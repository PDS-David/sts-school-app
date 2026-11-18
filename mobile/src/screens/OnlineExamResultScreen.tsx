import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import api from '../api/client';
import { Card, Btn, Loader } from '../components/UI';
import { Colors, Spacing, Fonts } from '../theme';

export default function OnlineExamResultScreen({route,navigation}:any){
  const {attemptId}=route.params;
  const [data,setData]=useState<any>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const load=useCallback(async()=>{
    setLoading(true);setError('');
    try{const response=await api.get('/online-exams/attempts/'+attemptId+'/results');setData(response.data);}
    catch(e:any){setError(e?.response?.data?.error??'Could not load examination result.');}
    finally{setLoading(false);}
  },[attemptId]);
  useEffect(()=>{load();},[load]);
  if(loading)return <Loader/>;
  if(!data)return <View style={styles.container}><Text style={styles.error}>{error}</Text><Btn title="Retry" onPress={load}/></View>;
  const a=data.attempt;
  return <ScrollView style={styles.container} contentContainerStyle={{paddingBottom:Spacing.xl}}>
    <Card style={styles.summary}>
      <Text style={styles.title}>{a.title}</Text>
      <Text style={styles.meta}>{a.subject_name} · {a.board} · {a.examination_type}</Text>
      <Text style={styles.score}>{a.percentage==null?'Awaiting marking':Number(a.percentage).toFixed(1)+'%'}</Text>
      <Text style={styles.meta}>{a.score==null?'Provisional score':Number(a.score)+' / '+Number(a.total_marks)+' marks'}</Text>
      {a.status==='under_review'?<Text style={styles.notice}>Some written answers are awaiting review. Your final result will be updated after marking.</Text>:null}
    </Card>
    {data.responses.map((r:any,index:number)=><Card key={r.id} style={styles.answer}>
      <Text style={styles.meta}>Question {index+1} · {r.marks} marks</Text>
      <Text style={styles.question}>{r.stem}</Text>
      <Text style={styles.answerText}>Your response: {typeof r.response==='string'?r.response:(r.response?.key??JSON.stringify(r.response??'Not answered'))}</Text>
      <Text style={styles.meta}>Awarded: {r.awarded_marks==null?'Pending':r.awarded_marks+' / '+r.marks}</Text>
      {r.feedback?<Text style={styles.feedback}>{r.feedback}</Text>:null}
      {r.marking_status==='pending_review'?<Text style={styles.notice}>Awaiting examiner review</Text>:null}
    </Card>)}
    <Btn title="Back to examinations" onPress={()=>navigation.navigate('OnlineExams')}/>
  </ScrollView>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:Colors.background,padding:Spacing.md},
 summary:{marginBottom:Spacing.md,alignItems:'center'},
 title:{fontSize:Fonts.sizes.lg,fontWeight:'800',color:Colors.text,textAlign:'center'},
 meta:{fontSize:Fonts.sizes.xs,color:Colors.textSub,marginTop:4},
 score:{fontSize:34,fontWeight:'900',color:Colors.primary,marginTop:Spacing.md},
 answer:{marginBottom:Spacing.sm},
 question:{fontSize:Fonts.sizes.md,fontWeight:'700',color:Colors.text,marginVertical:Spacing.sm},
 answerText:{fontSize:Fonts.sizes.sm,color:Colors.text,lineHeight:21},
 feedback:{fontSize:Fonts.sizes.sm,color:Colors.primary,marginTop:Spacing.sm},
 notice:{fontSize:Fonts.sizes.sm,color:Colors.primary,marginTop:Spacing.sm,textAlign:'center'},
 error:{color:Colors.error}
});
