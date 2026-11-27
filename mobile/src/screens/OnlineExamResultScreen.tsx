import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';
import { Card, Btn, Loader } from '../components/UI';
import { Colors, Spacing, Fonts } from '../theme';

export default function OnlineExamResultScreen({route,navigation}:any){
  const {attemptId}=route.params;
  const [data,setData]=useState<any>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [unsyncedCount,setUnsyncedCount]=useState(0);
  const load=useCallback(async()=>{
    setLoading(true);setError('');
    try{const response=await api.get('/online-exams/attempts/'+attemptId+'/results');setData(response.data);}
    catch(e:any){setError(e?.response?.data?.error??'Could not load examination result.');}
    finally{setLoading(false);}
  },[attemptId]);
  useEffect(()=>{load();},[load]);
  useEffect(()=>{
    let active=true;
    AsyncStorage.getItem('online-exam-attempt:'+attemptId).then(raw=>{
      if(!active||!raw)return;
      try{setUnsyncedCount(Object.keys(JSON.parse(raw)||{}).length);}catch{setUnsyncedCount(0);}
    }).catch(()=>undefined);
    return()=>{active=false;};
  },[attemptId]);
  if(loading)return <Loader/>;
  if(!data)return <View style={styles.container}><Text style={styles.error}>{error}</Text><Btn label="Retry" onPress={load}/></View>;
  const a=data.attempt;
  const provisional=a.status==='under_review';
  const finalised=a.status==='submitted';
  return <ScrollView style={styles.container} contentContainerStyle={{paddingBottom:Spacing.xl}}>
    {unsyncedCount>0?<Text style={styles.warning}>{unsyncedCount} answer(s) remain stored on this device because the server deadline closed before they could be saved. Contact your school administrator; this local copy has been retained.</Text>:null}
    <Card style={styles.summary}>
      <Text style={styles.title}>{a.title}</Text>
      <Text style={styles.meta}>{a.subject_name} · {a.board} · {a.examination_type}</Text>
      <Text style={[styles.resultStatus,{color:provisional?Colors.warning:Colors.success}]}>
        {provisional?'PROVISIONAL RESULT — REVIEW PENDING':finalised?'FINAL RESULT':'RESULT STATUS: '+String(a.status??'unknown').replace(/_/g,' ').toUpperCase()}
      </Text>
      <Text style={styles.score}>{a.percentage==null?'Awaiting final score':Number(a.percentage).toFixed(1)+'%'}</Text>
      <Text style={styles.meta}>{a.score==null?'Provisional marks':Number(a.score)+' / '+Number(a.total_marks)+' marks'}</Text>
      {provisional?<Text style={styles.notice}>At least one written answer needs examiner review. This score is not final and may change after review.</Text>:null}
      {finalised?<Text style={styles.finalNote}>All responses have been marked. This is your final online examination result.</Text>:null}
    </Card>
    <Text style={styles.sectionTitle}>Question-by-question feedback</Text>
    {data.responses.map((r:any,index:number)=>{
      const details=r.marking_details??{};
      const criteria=Array.isArray(details.criterion_scores)?details.criterion_scores:[];
      const confidence=Number(r.marking_confidence);
      const hasConfidence=r.marking_confidence!==null&&r.marking_confidence!==undefined&&Number.isFinite(confidence);
      return <Card key={r.id} style={styles.answer}>
        <Text style={styles.meta}>Question {index+1} · {r.marks} marks</Text>
        <Text style={styles.question}>{r.stem}</Text>
        <Text style={styles.answerText}>Your response: {typeof r.response==='string'?r.response:(r.response?.key??JSON.stringify(r.response??'Not answered'))}</Text>
        <Text style={styles.meta}>Awarded: {r.awarded_marks==null?'Pending examiner review':r.awarded_marks+' / '+r.marks}</Text>
        {hasConfidence?<Text style={styles.confidence}>AI marking confidence: {Math.round(confidence*100)}%</Text>:null}
        {r.feedback?<Text style={styles.feedback}>{r.feedback}</Text>:null}
        {criteria.length>0?<View style={styles.rubric}>
          <Text style={styles.rubricTitle}>Marking breakdown</Text>
          {criteria.map((criterion:any)=><View key={criterion.criterion_id} style={styles.criterion}>
            <Text style={styles.criterionName}>{String(criterion.criterion_id).replace(/[_-]/g,' ')}</Text>
            <Text style={styles.meta}>{criterion.points} marks</Text>
            {criterion.rationale?<Text style={styles.rationale}>{criterion.rationale}</Text>:null}
          </View>)}
        </View>:null}
        {r.marking_status==='pending_review'?<Text style={styles.notice}>Awaiting examiner review. No final mark has been assigned to this response yet.</Text>:null}
      </Card>;
    })}
    <Btn label="Back to examinations" onPress={()=>navigation.navigate('OnlineExams')}/>
  </ScrollView>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:Colors.background,padding:Spacing.md},
 summary:{marginBottom:Spacing.md,alignItems:'center'},
 title:{fontSize:Fonts.sizes.lg,fontWeight:'800',color:Colors.text,textAlign:'center'},
 meta:{fontSize:Fonts.sizes.xs,color:Colors.textSub,marginTop:4},
 resultStatus:{fontSize:Fonts.sizes.xs,fontWeight:'900',textAlign:'center',marginTop:Spacing.md},
 score:{fontSize:34,fontWeight:'900',color:Colors.primary,marginTop:Spacing.sm},
 sectionTitle:{fontSize:Fonts.sizes.md,fontWeight:'800',color:Colors.text,marginBottom:Spacing.sm},
 answer:{marginBottom:Spacing.sm},
 question:{fontSize:Fonts.sizes.md,fontWeight:'700',color:Colors.text,marginVertical:Spacing.sm},
 answerText:{fontSize:Fonts.sizes.sm,color:Colors.text,lineHeight:21},
 confidence:{fontSize:Fonts.sizes.xs,color:Colors.textSub,marginTop:Spacing.sm,fontWeight:'700'},
 feedback:{fontSize:Fonts.sizes.sm,color:Colors.primary,marginTop:Spacing.sm,lineHeight:20},
 rubric:{marginTop:Spacing.sm,paddingTop:Spacing.sm,borderTopWidth:1,borderTopColor:Colors.border},
 rubricTitle:{fontSize:Fonts.sizes.sm,fontWeight:'800',color:Colors.text,marginBottom:Spacing.xs},
 criterion:{paddingVertical:Spacing.xs},
 criterionName:{fontSize:Fonts.sizes.sm,fontWeight:'700',color:Colors.text,textTransform:'capitalize'},
 rationale:{fontSize:Fonts.sizes.xs,color:Colors.textSub,lineHeight:18,marginTop:2},
 notice:{fontSize:Fonts.sizes.sm,color:Colors.warning,marginTop:Spacing.sm,lineHeight:20},
 finalNote:{fontSize:Fonts.sizes.sm,color:Colors.success,marginTop:Spacing.sm,textAlign:'center'},
 warning:{fontSize:Fonts.sizes.sm,color:Colors.warning,marginBottom:Spacing.md,lineHeight:20},
 error:{color:Colors.error}
});
