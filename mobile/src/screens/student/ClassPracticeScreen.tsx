import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { Card, Btn, Loader, Empty, SectionHeader, Badge } from '../../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../../theme';

export default function ClassPracticeScreen({ route }: any) {
  const topic = route.params?.topic;
  const [practiceSet,setPracticeSet]=useState<any>(null);
  const [questions,setQuestions]=useState<any[]>([]);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [result,setResult]=useState<any>(null);
  const [progress,setProgress]=useState<any>({concept_performance:[],remediation_recommendations:[]});
  const [generating,setGenerating]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [loadingProgress,setLoadingProgress]=useState(true);
  const [error,setError]=useState('');
  const [progressError,setProgressError]=useState('');
  const topicIdRef=useRef(topic?.id);
  topicIdRef.current=topic?.id;

  const loadProgress=async()=>{
    setLoadingProgress(true);setProgressError('');
    try{
      const {data}=await api.get('/class-practice/progress');
      setProgress(data??{concept_performance:[],remediation_recommendations:[]});
    }catch{
      setProgressError('Could not load your practice history. Check your connection and retry.');
    }finally{setLoadingProgress(false);}
  };

  useEffect(()=>{
    topicIdRef.current=topic?.id;
    setPracticeSet(null);setQuestions([]);setAnswers({});setResult(null);
    setGenerating(false);setSubmitting(false);setError('');
    void loadProgress();
  },[topic?.id]);

  const generate=async()=>{
    if(!topic?.id||generating||submitting)return;
    setGenerating(true);setError('');setResult(null);setPracticeSet(null);setQuestions([]);setAnswers({});
    const requestedTopicId=topic.id;
    try{
      const {data}=await api.post('/class-practice/sets',{topic_id:Number(requestedTopicId)});
      if(topicIdRef.current!==requestedTopicId)return;
      if(!data.set?.id||!Array.isArray(data.questions)||data.questions.length<3) throw new Error('The practice set is incomplete. Please retry.');
      setPracticeSet(data.set);setQuestions(data.questions);
    }catch(e:any){
      if(topicIdRef.current===requestedTopicId)setError(e?.response?.data?.error??e?.message??'Could not generate practice for this completed lesson. Check your connection and retry.');
    }finally{if(topicIdRef.current===requestedTopicId)setGenerating(false);}
  };

  const submit=async()=>{
    if(!practiceSet||submitting)return;
    if(questions.some(q=>!answers[q.id])){
      setError('Answer every question before submitting your practice.');
      return;
    }
    setSubmitting(true);setError('');
    const submittedTopicId=topic.id;
    const submittedSetId=practiceSet.id;
    try{
      const response=await api.post('/class-practice/sets/'+submittedSetId+'/submit',{
        answers:questions.map(q=>({question_id:q.id,answer:answers[q.id]})),
      });
      if(response.queuedOffline)throw new Error('Your submission is queued offline and has not yet been confirmed. Reconnect before treating it as submitted.');
      if(topicIdRef.current===submittedTopicId){setResult(response.data);await loadProgress();}
    }catch(e:any){
      // A timed-out response may still have committed on the server. Recover
      // the owner's persisted result before asking the student to retry.
      try{
        const {data}=await api.get('/class-practice/sets/'+submittedSetId);
        if(topicIdRef.current===submittedTopicId&&data?.result?.submitted){setResult(data.result);await loadProgress();return;}
      }catch{/* Keep the original submit error when the recovery request also fails. */}
      if(topicIdRef.current===submittedTopicId)setError(e?.response?.data?.error??e?.message??'Your answers could not be confirmed. Reconnect and retry; completed results are recovered automatically.');
    }finally{if(topicIdRef.current===submittedTopicId)setSubmitting(false);}
  };

  if(!topic?.id)return <Empty message="Open a completed lesson to start adaptive practice."/>;

  return(
    <ScrollView style={{flex:1,backgroundColor:Colors.background}} contentContainerStyle={{padding:Spacing.md,paddingBottom:Spacing.xl}}>
      <Card>
        <SectionHeader title="Adaptive AI Practice"/>
        <Text style={styles.topic}>{topic.title}</Text>
        <Text style={styles.sub}>{topic.subject_name??'Subject'} · {topic.class_name??'Your class'}</Text>
        <Text style={styles.copy}>Questions are generated only from this completed lesson. Your previous concept performance guides the next practice set.</Text>
        {!practiceSet&&!result&&<Btn label={generating?'Generating practice…':'Generate practice questions'} onPress={generate} loading={generating} style={{marginTop:Spacing.md}}/>}
        {practiceSet&&!result&&(
          <View style={{marginTop:Spacing.md}}>
            <Badge label="Lesson-grounded practice" color={Colors.success}/>
            {questions.map((q,index)=>(
              <View key={q.id} style={styles.question}>
                <Text style={styles.questionTitle}>{index+1}. {q.question}</Text>
                <Text style={styles.concept}>Concept: {q.concept} · {q.marks} mark{Number(q.marks)===1?'':'s'}</Text>
                {q.options.map((option:any)=>(
                  <TouchableOpacity key={option.key} onPress={()=>setAnswers(current=>({...current,[q.id]:option.key}))} style={[styles.option,answers[q.id]===option.key&&styles.optionSelected]} accessibilityRole="radio" accessibilityState={{checked:answers[q.id]===option.key}}>
                    <View style={[styles.radio,answers[q.id]===option.key&&styles.radioSelected]}>
                      {answers[q.id]===option.key?<View style={styles.radioDot}/>:null}
                    </View>
                    <Text style={styles.optionText}>{option.key}. {option.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            <Text style={styles.progressText}>{Object.keys(answers).length} of {questions.length} answered</Text>
            <Btn label={submitting?'Submitting…':'Submit practice'} onPress={submit} loading={submitting} disabled={submitting||Object.keys(answers).length!==questions.length}/>
          </View>
        )}
        {result&&(
          <View style={{marginTop:Spacing.md}}>
            <View style={styles.scoreRow}>
              <View><Text style={styles.scoreLabel}>Your score</Text><Text style={styles.score}>{result.score} / {result.total}</Text></View>
              <Badge label={String(result.percentage)+'%'} color={result.percentage>=70?Colors.success:Colors.warning}/>
            </View>
            <Text style={styles.copy}>Review each explanation, then use your weak-concept recommendations below to guide revision.</Text>
            {(result.results??[]).map((item:any,index:number)=>(
              <View key={item.question_id} style={styles.resultItem}>
                <View style={styles.resultHead}>
                  <Text style={styles.resultTitle}>Question {index+1}</Text>
                  <Badge label={item.correct?'Correct':'Review'} color={item.correct?Colors.success:Colors.error}/>
                </View>
                <Text style={styles.concept}>{item.concept} · {item.marks_awarded}/{item.marks_available} marks</Text>
                <Text style={styles.feedback}>{item.correct?'Your answer is correct.':'Your answer needs review.'} {item.explanation}</Text>
              </View>
            ))}
            <Btn label="Generate another practice set" onPress={generate} loading={generating} style={{marginTop:Spacing.md}}/>
          </View>
        )}
        {error?<Text style={styles.error}>{error}</Text>:null}
      </Card>

      <Card style={{marginTop:Spacing.md}}>
        <SectionHeader title="Your concept progress"/>
        {loadingProgress?<Loader/>:null}
        {!loadingProgress&&progressError?<View><Text style={styles.error}>{progressError}</Text><Btn label="Retry loading progress" variant="outline" onPress={loadProgress} style={{marginTop:Spacing.sm}}/></View>:null}
        {!loadingProgress&&!progressError&&progress.concept_performance?.length===0?<Text style={styles.sub}>Complete a practice set to start building your concept history.</Text>:null}
        {!progressError&&(progress.concept_performance??[]).slice(0,8).map((item:any)=>(
          <View key={item.topic_id+':'+item.concept} style={styles.progressItem}>
            <View style={{flex:1}}>
              <Text style={styles.progressTitle}>{item.concept}</Text>
              <Text style={styles.sub}>{item.topic_title} · {item.attempts} attempts</Text>
            </View>
            <Badge label={Math.round(Number(item.accuracy)*100)+'%'} color={Number(item.accuracy)>=0.7?Colors.success:Colors.warning}/>
          </View>
        ))}
        {!progressError&&(progress.remediation_recommendations??[]).length>0?(
          <View style={{marginTop:Spacing.md}}>
            <Text style={styles.sectionLabel}>Recommended revision</Text>
            {progress.remediation_recommendations.map((item:any)=>(
              <View key={item.id} style={styles.recommendation}>
                <Ionicons name="book-outline" size={18} color={Colors.primary}/>
                <View style={{flex:1}}>
                  <Text style={styles.progressTitle}>{item.concept}</Text>
                  <Text style={styles.sub}>{item.recommendation}</Text>
                </View>
              </View>
            ))}
          </View>
        ):null}
      </Card>
    </ScrollView>
  );
}

const styles=StyleSheet.create({
  topic:{fontSize:Fonts.sizes.md,fontWeight:'700',color:Colors.text},
  sub:{fontSize:Fonts.sizes.xs,color:Colors.textSub,marginTop:3},
  copy:{fontSize:Fonts.sizes.sm,color:Colors.text,marginTop:Spacing.sm,lineHeight:21},
  question:{borderTopWidth:1,borderTopColor:Colors.border,marginTop:Spacing.md,paddingTop:Spacing.md},
  questionTitle:{fontSize:Fonts.sizes.md,fontWeight:'700',color:Colors.text,lineHeight:23},
  concept:{fontSize:Fonts.sizes.xs,color:Colors.textSub,marginTop:4,marginBottom:Spacing.xs},
  option:{flexDirection:'row',alignItems:'center',gap:Spacing.sm,borderWidth:1,borderColor:Colors.border,borderRadius:Radius.md,padding:Spacing.sm,marginTop:Spacing.xs},
  optionSelected:{borderColor:Colors.primary,backgroundColor:Colors.primary+'10'},
  radio:{width:20,height:20,borderRadius:10,borderWidth:1.5,borderColor:Colors.textSub,alignItems:'center',justifyContent:'center'},
  radioSelected:{borderColor:Colors.primary},
  radioDot:{width:10,height:10,borderRadius:5,backgroundColor:Colors.primary},
  optionText:{flex:1,fontSize:Fonts.sizes.sm,color:Colors.text},
  progressText:{fontSize:Fonts.sizes.xs,color:Colors.textSub,marginVertical:Spacing.sm},
  scoreRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  scoreLabel:{fontSize:Fonts.sizes.xs,color:Colors.textSub},
  score:{fontSize:28,fontWeight:'800',color:Colors.primary},
  resultItem:{borderTopWidth:1,borderTopColor:Colors.border,paddingTop:Spacing.sm,marginTop:Spacing.sm},
  resultHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  resultTitle:{fontSize:Fonts.sizes.sm,fontWeight:'700',color:Colors.text},
  feedback:{fontSize:Fonts.sizes.sm,color:Colors.text,marginTop:Spacing.xs,lineHeight:20},
  progressItem:{flexDirection:'row',alignItems:'center',paddingVertical:Spacing.sm,borderTopWidth:1,borderTopColor:Colors.border},
  progressTitle:{fontSize:Fonts.sizes.sm,fontWeight:'700',color:Colors.text},
  sectionLabel:{fontSize:Fonts.sizes.sm,fontWeight:'700',color:Colors.text,marginBottom:Spacing.xs},
  recommendation:{flexDirection:'row',gap:Spacing.sm,alignItems:'flex-start',paddingVertical:Spacing.sm},
  error:{color:Colors.error,fontSize:Fonts.sizes.sm,marginTop:Spacing.md},
});
