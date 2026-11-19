import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { Card, Btn, Loader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';

export default function OnlineExamAttemptScreen({ route, navigation }:any) {
  const {attemptId,initialSession}=route.params;
  const [session,setSession]=useState<any>(initialSession??null);
  const [responses,setResponses]=useState<Record<string,any>>({});
  const [remaining,setRemaining]=useState(0);
  const [clockReady,setClockReady]=useState(false);
  const [loading,setLoading]=useState(!initialSession);
  const [saving,setSaving]=useState(false);
  const [online,setOnline]=useState(true);
  const [error,setError]=useState('');
  const pending=useRef<Record<string,any>>({});
  const saveQueue=useRef<Record<string,Promise<any>>>({});
  const autoSubmitAttempted=useRef(false);
  const clockOffset=useRef(0);
  const storageKey='online-exam-attempt:'+attemptId;

  const saveOne=useCallback(async(questionId:string,response:any)=>{
    pending.current[questionId]=response;
    await AsyncStorage.setItem(storageKey,JSON.stringify(pending.current));
    const previous=saveQueue.current[questionId]??Promise.resolve();
    const queued=previous.catch(()=>undefined).then(async()=>{
      try{
        await api.put('/online-exams/attempts/'+attemptId+'/responses/'+questionId,{response});
        if(JSON.stringify(pending.current[questionId])===JSON.stringify(response)) delete pending.current[questionId];
        await AsyncStorage.setItem(storageKey,JSON.stringify(pending.current));
        setError('');
      }catch(e:any){
        setError(online?'Response is retained on this device and will retry when connected.':'Offline: response is stored locally until reconnection.');
        throw e;
      }
    });
    saveQueue.current[questionId]=queued;
    try{await queued;}catch{/* retained locally for retry */}
  },[attemptId,online,storageKey]);

  const load=useCallback(async()=>{
    setLoading(true);setError('');
    const cachedSessionRaw=await AsyncStorage.getItem(storageKey+':session');
    const cachedResponsesRaw=await AsyncStorage.getItem(storageKey);
    const cachedSession=cachedSessionRaw?JSON.parse(cachedSessionRaw):null;
    const cachedResponses=cachedResponsesRaw?JSON.parse(cachedResponsesRaw):{};
    try{
      const {data}=await api.get('/online-exams/attempts/'+attemptId);
      setSession(data);
      await AsyncStorage.setItem(storageKey+':session',JSON.stringify(data));
      clockOffset.current=new Date(data.attempt.server_time).getTime()-Date.now();
      const remote=Object.fromEntries((data.saved_responses??[]).map((x:any)=>[x.exam_question_id,x.response]));
      const local=cachedResponses;
      const merged={...remote,...local};
      setResponses(merged);
      pending.current=local;
      for(const [qid,value] of Object.entries(local)) await saveOne(qid,value);
    }catch(e:any){
      if(cachedSession?.questions){
        setSession(cachedSession);
        setResponses(cachedResponses);
        pending.current=cachedResponses;
        clockOffset.current=0;
        setError('Offline recovery: showing the last cached examination. Unsynced answers will upload when connection returns.');
      }else setError(e?.response?.data?.error??'Could not recover this examination attempt.');
    }finally{setLoading(false);}
  },[attemptId,saveOne,storageKey]);
  useEffect(()=>{if(initialSession) AsyncStorage.setItem(storageKey+':session',JSON.stringify(initialSession));},[initialSession,storageKey]);
  useEffect(()=>{load();},[load]);
  useEffect(()=>{
    const unsubscribe=NetInfo.addEventListener(state=>setOnline(!!state.isConnected));
    return unsubscribe;
  },[]);
  useEffect(()=>{
    if(!session?.attempt?.deadline_at)return;
    const tick=()=>{
      const serverNow=Date.now()+clockOffset.current;
      const seconds=Math.max(0,Math.floor((new Date(session.attempt.deadline_at).getTime()-serverNow)/1000));
      setRemaining(seconds);setClockReady(true);
    };
    tick();const timer=setInterval(tick,1000);return()=>clearInterval(timer);
  },[session]);
  useEffect(()=>{
    if(clockReady && remaining===0 && session?.attempt?.deadline_at && !loading && online && !autoSubmitAttempted.current){ autoSubmitAttempted.current=true; submit(true); }
  },[remaining,session,loading,clockReady,online]);

  useEffect(()=>{
    if(online && Object.keys(pending.current).length){
      (async()=>{for(const [qid,value] of Object.entries(pending.current)) await saveOne(qid,value);})();
    }
  },[online,saveOne]);

  const change=(qid:string,value:any)=>{
    setResponses(old=>({...old,[qid]:value}));
    saveOne(qid,value);
  };
  const submit=async(auto=false)=>{
    if(saving)return;
    setSaving(true);setError('');
    try{
      const net=await NetInfo.fetch();
      if(!net.isConnected)throw new Error('Connect to the internet before submitting. Your saved answers are retained on this device.');
      for(const [qid,value] of Object.entries(pending.current)){
        await saveQueue.current[qid]?.catch(()=>undefined);
        if(pending.current[qid]===undefined)continue;
        try{
          await api.put('/online-exams/attempts/'+attemptId+'/responses/'+qid,{response:value});
          if(JSON.stringify(pending.current[qid])===JSON.stringify(value))delete pending.current[qid];
        }catch(e:any){
          if(e?.response?.status!==409)throw e;
          // A 409 means the server deadline/status has closed autosave. Keep
          // this answer locally; never discard a response the server refused.
        }
      }
      const {data}=await api.post('/online-exams/attempts/'+attemptId+'/submit',{confirm:true});
      const unsyncedCount=Object.keys(pending.current).length;
      if(unsyncedCount>0){
        await AsyncStorage.setItem(storageKey,JSON.stringify(pending.current));
        await AsyncStorage.setItem(storageKey+':session',JSON.stringify(session));
        Alert.alert('Submitted with locally retained answers',
          'The server accepted your submission, but '+unsyncedCount+' response(s) could not be saved before the deadline. A copy remains on this device. Contact your school administrator immediately and do not clear app storage.');
      }else{
        await AsyncStorage.setItem(storageKey,JSON.stringify({}));
        await AsyncStorage.removeItem(storageKey+':session');
        Alert.alert(auto?'Time is up':'Examination submitted',data.status==='under_review'?'Your answers were submitted. Some written responses are awaiting marking.':'Your examination has been submitted successfully.');
      }
      navigation.replace('OnlineExams');
    }catch(e:any){setError(e?.response?.data?.error??e.message??'Submission failed. Please retry.');}
    finally{setSaving(false);}
  };
  if(loading)return <Loader/>;
  if(!session?.questions)return <View style={styles.container}><Text style={styles.error}>{error||'Examination attempt unavailable.'}</Text><Btn label="Retry recovery" onPress={load}/></View>;
  const fmt=(s:number)=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
  return <View style={styles.container}>
    <View style={styles.timerBar}>
      <View style={{flex:1}}><Text style={styles.heading}>{session.exam.title}</Text><Text style={styles.meta}>{session.exam.subject_name} · {session.exam.board}</Text></View>
      <View style={styles.timer}><Ionicons name="time-outline" size={18} color={remaining<300?Colors.error:Colors.primary}/><Text style={[styles.timerText,{color:remaining<300?Colors.error:Colors.primary}]}>{fmt(remaining)}</Text></View>
    </View>
    {!online?<Text style={styles.warning}>Offline. Previously saved answers are safe; unsent changes are kept locally.</Text>:null}
    {error?<Text style={styles.error}>{error}</Text>:null}
    <ScrollView contentContainerStyle={{paddingBottom:Spacing.xl}}>
      <Card style={styles.instructions}><Text style={styles.sectionTitle}>Instructions</Text><Text style={styles.body}>{session.exam.instructions}</Text></Card>
      {session.questions.map((q:any,index:number)=>(
        <Card key={q.id} style={styles.question}>
          <Text style={styles.meta}>{q.section_title} · Question {index+1} · {q.marks} mark(s)</Text>
          <Text style={styles.questionText}>{q.question.stem}</Text>
          {q.question.type==='mcq' && (q.question.options??[]).map((option:any)=>(
            <TouchableOpacity key={option.key} style={[styles.option,responses[q.id]?.key===option.key&&styles.optionSelected]}
              onPress={()=>change(q.id,{key:option.key})}>
              <Ionicons name={responses[q.id]?.key===option.key?'radio-button-on':'radio-button-off'} size={20} color={Colors.primary}/>
              <Text style={styles.optionText}>{option.key}. {option.text}</Text>
            </TouchableOpacity>
          ))}
          {q.question.type!=='mcq' && <TextInput multiline value={typeof responses[q.id]==='string'?responses[q.id]:''}
            onChangeText={v=>change(q.id,v)} placeholder="Type your answer here" placeholderTextColor={Colors.textSub}
            style={styles.answerInput}/>}
        </Card>
      ))}
      <Btn label={saving?'Saving…':'Submit examination'} onPress={()=>Alert.alert('Submit examination?','You cannot change your answers after submission.',[
        {text:'Continue exam',style:'cancel'},{text:'Submit',style:'destructive',onPress:()=>submit(false)}
      ])} disabled={saving}/>
      {saving?<ActivityIndicator color={Colors.primary} style={{marginTop:Spacing.sm}}/>:null}
    </ScrollView>
  </View>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:Colors.background,padding:Spacing.md},
 timerBar:{flexDirection:'row',alignItems:'center',gap:Spacing.sm,marginBottom:Spacing.md},
 heading:{fontSize:Fonts.sizes.lg,fontWeight:'800',color:Colors.text},
 meta:{fontSize:Fonts.sizes.xs,color:Colors.textSub,marginBottom:Spacing.sm},
 timer:{flexDirection:'row',alignItems:'center',gap:4,backgroundColor:Colors.card,borderRadius:Radius.md,padding:Spacing.sm},
 timerText:{fontSize:Fonts.sizes.lg,fontWeight:'900',fontVariant:['tabular-nums']},
 instructions:{marginBottom:Spacing.md},
 sectionTitle:{fontSize:Fonts.sizes.md,fontWeight:'800',color:Colors.text,marginBottom:Spacing.xs},
 body:{fontSize:Fonts.sizes.sm,color:Colors.text,lineHeight:21},
 question:{marginBottom:Spacing.md},
 questionText:{fontSize:Fonts.sizes.md,fontWeight:'600',color:Colors.text,marginBottom:Spacing.sm,lineHeight:23},
 option:{flexDirection:'row',alignItems:'center',gap:Spacing.sm,padding:Spacing.sm,borderWidth:1,borderColor:Colors.border,borderRadius:Radius.md,marginBottom:Spacing.xs},
 optionSelected:{borderColor:Colors.primary,backgroundColor:Colors.primary+'12'},
 optionText:{flex:1,color:Colors.text,fontSize:Fonts.sizes.sm},
 answerInput:{minHeight:110,borderWidth:1,borderColor:Colors.border,borderRadius:Radius.md,padding:Spacing.sm,color:Colors.text,textAlignVertical:'top'},
 warning:{color:Colors.error,marginBottom:Spacing.sm,fontWeight:'700'},
 error:{color:Colors.error,marginBottom:Spacing.sm}
});
