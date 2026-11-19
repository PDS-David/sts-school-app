import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { Card, Loader, Empty, Btn } from '../components/UI';
import { Colors, Spacing, Fonts } from '../theme';

export default function OnlineExamsScreen({ navigation }: any) {
  const [exams,setExams]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,setError]=useState('');
  const load=useCallback(async(refresh=false)=>{
    refresh?setRefreshing(true):setLoading(true); setError('');
    try{const {data}=await api.get('/online-exams/exams');setExams(data.exams??[]);}
    catch(e:any){setError(e?.response?.data?.error??'Could not load formal examinations.');}
    finally{setLoading(false);setRefreshing(false);}
  },[]);
  useEffect(()=>{load();},[load]);
  const open=async(exam:any)=>{
    try{
      let session:any;
      if(exam.attempt_id && ['in_progress','expired','submitting'].includes(exam.attempt_status)){
        const {data}=await api.get('/online-exams/attempts/'+exam.attempt_id);session=data;
      }else{
        const {data}=await api.post('/online-exams/exams/'+exam.id+'/start');session=data;
      }
      navigation.navigate('OnlineExamAttempt',{attemptId:session.attempt.id,initialSession:session});
    }catch(e:any){setError(e?.response?.data?.error??'This examination cannot be opened right now.');load(true);}
  };
  const render=({item}:any)=>{
    const status=item.attempt_status;
    const closed=['submitted','under_review'].includes(status);
    const resumable=['in_progress','expired','submitting'].includes(status);
    const beforeStart=Date.now()<new Date(item.starts_at).getTime();
    const afterEnd=Date.now()>=new Date(item.ends_at).getTime();
    const blocked=!resumable&&(beforeStart||afterEnd);
    return <Card style={styles.card}>
      <View style={styles.top}>
        <View style={{flex:1}}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{item.subject_name} · {item.class_name} · {item.board}</Text>
          <Text style={styles.meta}>{item.examination_type}{item.exam_year ? ' · '+item.exam_year : ''} · {item.duration_minutes} minutes</Text>
        </View>
        <Ionicons name="school-outline" size={25} color={Colors.primary}/>
      </View>
      <Text style={styles.instructions}>{item.instructions}</Text>
      <Text style={styles.meta}>Opens: {new Date(item.starts_at).toLocaleString()}</Text>
      <Text style={styles.meta}>Closes: {new Date(item.ends_at).toLocaleString()}</Text>
      {status && <Text style={[styles.status,{color:closed?Colors.success:Colors.primary}]}>Attempt: {status.replace('_',' ')}</Text>}
      <Btn label={status==='in_progress'?'Resume examination':status==='expired'?'Submit saved answers':status==='submitting'?'Recover submission':closed?'Attempt closed':beforeStart?'Opens '+new Date(item.starts_at).toLocaleString():afterEnd?'Examination closed':'View instructions and start'} onPress={()=>open(item)} disabled={closed||blocked}/>
      {closed && item.attempt_id ? <Btn label="View result" variant="outline" onPress={()=>navigation.navigate('OnlineExamResult',{attemptId:item.attempt_id})}/> : null}
    </Card>;
  };
  if(loading)return <Loader/>;
  return <View style={styles.container}>
    <Text style={styles.heading}>Formal Online Examinations</Text>
    <Text style={styles.sub}>Only examinations assigned to your class are shown. Your time limit is controlled by the examination server.</Text>
    {error? <Text style={styles.error}>{error}</Text>:null}
    <FlatList data={exams} keyExtractor={x=>x.id} renderItem={render}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>load(true)}/>}
      ListEmptyComponent={<Empty message="Your class has no published online examination at the moment."/>}
      contentContainerStyle={{paddingBottom:Spacing.xl}}/>
  </View>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:Colors.background,padding:Spacing.md},
 heading:{fontSize:Fonts.sizes.xl,fontWeight:'800',color:Colors.text,marginBottom:6},
 sub:{fontSize:Fonts.sizes.sm,color:Colors.textSub,marginBottom:Spacing.md,lineHeight:21},
 card:{marginBottom:Spacing.md,gap:Spacing.sm},
 top:{flexDirection:'row',alignItems:'center',gap:Spacing.sm},
 title:{fontSize:Fonts.sizes.md,fontWeight:'800',color:Colors.text},
 meta:{fontSize:Fonts.sizes.xs,color:Colors.textSub,marginTop:4},
 instructions:{fontSize:Fonts.sizes.sm,color:Colors.text,lineHeight:20},
 status:{fontSize:Fonts.sizes.xs,fontWeight:'700',textTransform:'capitalize'},
 error:{color:Colors.error,marginBottom:Spacing.sm}
});
