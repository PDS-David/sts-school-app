import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { Card, Btn, Loader, Empty, Badge } from '../../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../../theme';
import { AppHeader } from '../../components/AppHeader';

export default function TeacherQuestionReviewScreen() {
  const [questions,setQuestions]=useState<any[]>([]);
  const [notes,setNotes]=useState<Record<string,string>>({});
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState<string|null>(null);
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');

  const load=useCallback(async()=>{
    setLoading(true);setError('');
    try{
      const {data}=await api.get('/question-bank/review-queue');
      setQuestions(data.questions??[]);
    }catch(e:any){
      setError(e?.response?.data?.error??'Could not load questions assigned to your subjects.');
    }finally{setLoading(false);}
  },[]);

  useEffect(()=>{void load();},[load]);

  const review=async(question:any,decision:'approved'|'rejected')=>{
    const note=(notes[question.id]??'').trim();
    if(note.length<10){setError('Enter at least 10 characters explaining your subject review before submitting.');return;}
    setBusy(question.id);setError('');setMessage('');
    try{
      const {data}=await api.post('/question-bank/questions/'+question.id+'/review',{decision,notes:note});
      if(decision==='approved') setQuestions(current=>current.filter(item=>item.id!==question.id));
      else setQuestions(current=>current.map(item=>item.id===question.id?{...item,my_decision:'rejected',my_notes:note}:item));
      setMessage(decision==='approved'?'Question approved for use in online examinations.':'Question returned for revision; the rejection is recorded.');
    }catch(e:any){
      setError(e?.response?.data?.error??'The review decision could not be saved.');
    }finally{setBusy(null);}
  };

  return(
    <View style={{flex:1,backgroundColor:Colors.background}}>
      <AppHeader title="Subject Question Review"/>
      {loading?<Loader/>:(
        <ScrollView contentContainerStyle={{padding:Spacing.md,paddingBottom:Spacing.xl}}>
          <Card>
            <Text style={styles.intro}>Review questions for subjects assigned to your teacher account. Approval makes a question eligible for formal online examinations; it does not change physical report marks or student records.</Text>
            <Text style={styles.meta}>Questions awaiting subject review: {questions.length}</Text>
            {error?<Text style={styles.error}>{error}</Text>:null}
            {message?<Text style={styles.success}>{message}</Text>:null}
            {questions.length===0?<Empty message="No questions are waiting for your assigned subjects."/>:null}
          </Card>
          {questions.map(question=>(
            <Card key={question.id} style={{marginTop:Spacing.md}}>
              <View style={styles.header}>
                <View style={{flex:1}}>
                  <Text style={styles.subject}>{question.subject} · {question.board}</Text>
                  <Text style={styles.meta}>{question.topic} · {question.paper} · {question.question_number}</Text>
                </View>
                <Badge label={question.review_status} color={Colors.warning}/>
              </View>
              <Text style={styles.stem}>{question.stem}</Text>
              {Array.isArray(question.options)?question.options.map((option:any,index:number)=>(
                <Text key={option.key??index} style={styles.option}>{option.key??String(index+1)+'.'} {option.text}</Text>
              )):null}
              <Text style={styles.answer}>Expected answer: {typeof question.correct_answer==='string'?question.correct_answer:JSON.stringify(question.correct_answer)}</Text>
              <Text style={styles.meta}>Mark value: {question.marks} · Rights: {question.rights_status} · Source: {question.source_name}</Text>
              {question.source_url?<Text style={styles.meta}>Source URL: {question.source_url}</Text>:null}
              {question.rights_evidence?<Text style={styles.meta}>Reuse-rights evidence: {question.rights_evidence}</Text>:null}
              <Text style={styles.explanation}>Marking explanation: {question.explanation}</Text>
              {question.my_decision?<Text style={styles.previous}>Your previous decision: {question.my_decision}. {question.my_notes}</Text>:null}
              <TextInput
                value={notes[question.id]??''}
                onChangeText={value=>setNotes(current=>({...current,[question.id]:value}))}
                placeholder="Record subject-review evidence (minimum 10 characters)"
                placeholderTextColor={Colors.textSub}
                multiline
                numberOfLines={3}
                style={styles.input}
                accessibilityLabel={'Review notes for '+question.subject+' question'}
              />
              <View style={styles.actions}>
                <Btn label={busy===question.id?'Saving…':'Approve'} onPress={()=>review(question,'approved')} loading={busy===question.id} disabled={!!busy} style={{flex:1}}/>
                <Btn label="Reject" onPress={()=>review(question,'rejected')} variant="outline" disabled={!!busy} style={{flex:1}}/>
              </View>
            </Card>
          ))}
          <TouchableOpacity onPress={load} style={styles.refresh}><Ionicons name="refresh" size={16} color={Colors.primary}/><Text style={styles.refreshText}>Refresh review queue</Text></TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles=StyleSheet.create({
  intro:{fontSize:Fonts.sizes.sm,color:Colors.text,lineHeight:21},
  meta:{fontSize:Fonts.sizes.xs,color:Colors.textSub,marginTop:4},
  header:{flexDirection:'row',alignItems:'center',gap:Spacing.sm},
  subject:{fontSize:Fonts.sizes.md,fontWeight:'700',color:Colors.text},
  stem:{fontSize:Fonts.sizes.md,fontWeight:'700',color:Colors.text,marginTop:Spacing.md,lineHeight:23},
  option:{fontSize:Fonts.sizes.sm,color:Colors.text,marginTop:Spacing.xs},
  answer:{fontSize:Fonts.sizes.sm,fontWeight:'700',color:Colors.text,marginTop:Spacing.sm},
  explanation:{fontSize:Fonts.sizes.sm,color:Colors.text,marginTop:Spacing.xs,lineHeight:20},
  previous:{fontSize:Fonts.sizes.xs,color:Colors.warning,marginTop:Spacing.sm},
  input:{borderWidth:1,borderColor:Colors.border,borderRadius:Radius.md,padding:Spacing.sm,minHeight:84,textAlignVertical:'top',marginTop:Spacing.md,color:Colors.text,backgroundColor:Colors.white},
  actions:{flexDirection:'row',gap:Spacing.sm,marginTop:Spacing.sm},
  error:{color:Colors.error,fontSize:Fonts.sizes.sm,marginTop:Spacing.sm},
  success:{color:Colors.success,fontSize:Fonts.sizes.sm,marginTop:Spacing.sm},
  refresh:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:Spacing.xs,padding:Spacing.md},
  refreshText:{color:Colors.primary,fontSize:Fonts.sizes.sm,fontWeight:'700'},
});
