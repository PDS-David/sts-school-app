import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { Card, Btn, Loader, Empty, Badge } from '../../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../../theme';
import { AppHeader } from '../../components/AppHeader';

const BOARDS=['WAEC','NECO','JAMB'];
const CLASSES=['JSS 3','SS 1','SS 2','SS 3'];
const iso=(offset:number)=>new Date(Date.now()+offset).toISOString();

function parseRubric(text:string,maximum:number){
  const lines=text.split(/\\r?\\n/).map(line=>line.trim()).filter(Boolean);
  if(lines.length<1||lines.length>20)return null;
  const criteria:any[]=[];
  const ids=new Set<string>();
  for(const line of lines){
    const parts=line.split('|');
    if(parts.length!==3)return null;
    const [id,description,rawMarks]=parts.map(part=>part.trim());
    const marks=Number(rawMarks);
    if(!/^[a-z0-9_-]{1,40}$/i.test(id)||ids.has(id)||description.length<5||description.length>500||!Number.isFinite(marks)||marks<=0)return null;
    ids.add(id);criteria.push({id,description,max_marks:marks});
  }
  const total=criteria.reduce((sum,item)=>sum+item.max_marks,0);
  return Math.abs(total-maximum)<=0.01?criteria:null;
}

export default function AdminOnlineExamsScreen() {
  const [mode,setMode]=useState<'list'|'create'|'attempts'|'responses'>('list');
  const [exams,setExams]=useState<any[]>([]);
  const [subjects,setSubjects]=useState<any[]>([]);
  const [questions,setQuestions]=useState<any[]>([]);
  const [lessonTopics,setLessonTopics]=useState<any[]>([]);
  const [selectedTopic,setSelectedTopic]=useState<any>(null);
  const [loadingTopics,setLoadingTopics]=useState(false);
  const [selectedQuestions,setSelectedQuestions]=useState<Record<string,boolean>>({});
  const [rubricInputs,setRubricInputs]=useState<Record<string,string>>({});
  const [selectedExam,setSelectedExam]=useState<any>(null);
  const [selectedAttempt,setSelectedAttempt]=useState<any>(null);
  const [attempts,setAttempts]=useState<any[]>([]);
  const [responses,setResponses]=useState<any[]>([]);
  const [marks,setMarks]=useState<Record<string,string>>({});
  const [feedback,setFeedback]=useState<Record<string,string>>({});
  const [board,setBoard]=useState('WAEC');
  const [className,setClassName]=useState('SS 3');
  const [subject,setSubject]=useState<any>(null);
  const [title,setTitle]=useState('');
  const [examType,setExamType]=useState('Mock');
  const [instructions,setInstructions]=useState('Read each question carefully. Answer all questions before submitting.');
  const [duration,setDuration]=useState('60');
  const [startsAt,setStartsAt]=useState(iso(24*60*60*1000));
  const [endsAt,setEndsAt]=useState(iso(26*60*60*1000));
  const [loading,setLoading]=useState(false);
  const [busy,setBusy]=useState<string|null>(null);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');

  const loadExams=useCallback(async()=>{
    setLoading(true);setError('');
    try{const {data}=await api.get('/online-exams/admin/exams');setExams(data.exams??[]);}
    catch(e:any){setError(e?.response?.data?.error??'Could not load examinations. Select the correct school and retry.');}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{void loadExams();},[loadExams]);

  const openCreate=async()=>{
    setMode('create');setError('');setNotice('');setSelectedQuestions({});
    try{const {data}=await api.get('/online-exams/admin/question-bank/subjects');setSubjects(data.subjects??[]);setSubject(null);setLessonTopics([]);setSelectedTopic(null);}
    catch(e:any){setError(e?.response?.data?.error??'Question-bank access is required to create a formal examination.');}
  };
  const loadQuestions=async(nextBoard:string,nextSubject:any)=>{
    if(!nextSubject)return;
    setLoading(true);setError('');setQuestions([]);setSelectedQuestions({});
    try{
      const {data}=await api.get('/online-exams/admin/question-bank/questions',{params:{board:nextBoard,subject_code:nextSubject.code,review_status:'approved'}});
      setQuestions(data.questions??[]);
      if((data.questions??[]).some((q:any)=>q.question_type!=='mcq'))
        setNotice('Written-response questions require a complete criterion rubric. Add one criterion per line using id|description|max_marks; the marks must sum to the question maximum.');
    }catch(e:any){setError(e?.response?.data?.error??'Could not load approved questions for this subject.');}
    finally{setLoading(false);}
  };
  const loadLessonTopics=async(nextSubject:any,nextClass:string)=>{
    if(!nextSubject)return;
    setLoadingTopics(true);setLessonTopics([]);setSelectedTopic(null);
    try{
      const {data}=await api.get('/online-exams/admin/lesson-topics',{params:{class_name:nextClass,subject_name:nextSubject.name}});
      setLessonTopics(data.topics??[]);
    }catch(e:any){setError(e?.response?.data?.error??'Could not load lesson coverage for this class and subject.');}
    finally{setLoadingTopics(false);}
  };
  const chooseBoard=async(value:string)=>{setBoard(value);if(subject)await loadQuestions(value,subject);};
  const chooseClass=async(value:string)=>{setClassName(value);setSelectedTopic(null);if(subject)await loadLessonTopics(subject,value);};
  const chooseSubject=async(value:any)=>{setSubject(value);await Promise.all([loadQuestions(board,value),loadLessonTopics(value,className)]);};
  const toggleQuestion=(id:string)=>setSelectedQuestions(current=>({...current,[id]:!current[id]}));

  const createExam=async()=>{
    const selected=questions.filter(q=>selectedQuestions[q.id]);
    if(!subject||!selectedTopic||selected.length===0){setError('Select a subject, a lesson completed by every candidate and at least one approved question.');return;}
    if(!title.trim()||!instructions.trim()||!Number.isInteger(Number(duration))||Number(duration)<1||Number(duration)>600){
      setError('Enter a title, instructions and a duration from 1 to 600 minutes.');return;
    }
    const examQuestions:any[]=[];
    for(const question of selected){
      const item:any={question_id:question.id,marks:Number(question.marks),covered_topic_id:Number(selectedTopic.id)};
      if(question.question_type!=='mcq'){
        const rubric=parseRubric(rubricInputs[question.id]??'',Number(question.marks));
        if(!rubric){setError('Complete a valid criterion rubric for every selected written-response question.');return;}
        item.marking_rubric=rubric;
      }
      examQuestions.push(item);
    }
    setBusy('create');setError('');setNotice('');
    try{
      await api.post('/online-exams/admin/exams',{
        board,subject_name:subject.name,class_name:className,examination_type:examType,title:title.trim(),
        instructions:instructions.trim(),duration_minutes:Number(duration),starts_at:startsAt,ends_at:endsAt,
        sections:[{title:'Section A',instructions:'Answer all questions in this section.',questions:examQuestions}],
      });
      setNotice('Examination draft created. Review its schedule and publish when candidate lesson coverage is complete.');
      setMode('list');await loadExams();
    }catch(e:any){setError(e?.response?.data?.error??'Could not create the examination draft.');}
    finally{setBusy(null);}
  };

  const publish=async(exam:any)=>{
    setBusy(exam.id);setError('');setNotice('');
    try{await api.post('/online-exams/admin/exams/'+exam.id+'/publish');setNotice('Examination published to eligible candidates.');await loadExams();}
    catch(e:any){setError(e?.response?.data?.error??'Publication was blocked. Check candidate coverage and the examination window.');}
    finally{setBusy(null);}
  };

  const openAttempts=async(exam:any)=>{
    setSelectedExam(exam);setMode('attempts');setLoading(true);setError('');
    try{const {data}=await api.get('/online-exams/admin/exams/'+exam.id+'/attempts');setAttempts(data.attempts??[]);}
    catch(e:any){setError(e?.response?.data?.error??'Could not load examination attempts.');}
    finally{setLoading(false);}
  };
  const openResponses=async(attempt:any)=>{
    setSelectedAttempt(attempt);setMode('responses');setLoading(true);setError('');
    try{const {data}=await api.get('/online-exams/admin/attempts/'+attempt.attempt_id+'/responses');setResponses(data.responses??[]);}
    catch(e:any){setError(e?.response?.data?.error??'Could not load candidate responses.');}
    finally{setLoading(false);}
  };
  const markResponse=async(response:any)=>{
    const awarded=Number(marks[response.question_id]);
    if(!Number.isFinite(awarded)||awarded<0||awarded>Number(response.marks)){
      setError('Enter a valid mark within the question maximum.');return;
    }
    setBusy(response.question_id);setError('');
    try{
      const {data:marked}=await api.put('/online-exams/admin/attempts/'+selectedAttempt.attempt_id+'/responses/'+response.question_id+'/mark',{
        awarded_marks:awarded,feedback:feedback[response.question_id]??'',
      });
      setSelectedAttempt((current:any)=>({...current,status:marked.attempt.status,score:marked.attempt.score,total_marks:marked.attempt.total_marks,percentage:marked.attempt.percentage}));
      const {data}=await api.get('/online-exams/admin/attempts/'+selectedAttempt.attempt_id+'/responses');
      setResponses(data.responses??[]);
      setNotice('Manual mark saved and the candidate total recalculated.');
    }catch(e:any){setError(e?.response?.data?.error??'Could not save the manual mark.');}
    finally{setBusy(null);}
  };

  const back=()=>{
    if(mode==='responses'){setMode('attempts');return;}
    if(mode==='attempts'||mode==='create'){setMode('list');return;}
    setMode('list');
  };

  return(
    <View style={{flex:1,backgroundColor:Colors.background}}>
      <AppHeader title="Formal Online Examinations"/>
      {loading?<Loader/>:(
        <ScrollView contentContainerStyle={{padding:Spacing.md,paddingBottom:Spacing.xl}}>
          {mode!=='list'?<TouchableOpacity onPress={back} style={styles.back}><Ionicons name="arrow-back" size={18} color={Colors.primary}/><Text style={styles.backText}>Back</Text></TouchableOpacity>:null}
          {error?<Card><Text style={styles.error}>{error}</Text></Card>:null}
          {notice?<Card><Text style={styles.notice}>{notice}</Text></Card>:null}

          {mode==='list'&&(
            <>
              <Btn label="Create formal examination" onPress={openCreate}/>
              {exams.length===0?<Empty message="No formal examinations have been created for this school."/>:null}
              {exams.map(exam=>(
                <Card key={exam.id} style={{marginTop:Spacing.md}}>
                  <View style={styles.row}>
                    <View style={{flex:1}}>
                      <Text style={styles.title}>{exam.title}</Text>
                      <Text style={styles.meta}>{exam.subject_name} · {exam.class_name} · {exam.board} · {exam.examination_type}</Text>
                    </View>
                    <Badge label={exam.status} color={exam.status==='published'?Colors.success:Colors.warning}/>
                  </View>
                  <Text style={styles.meta}>{exam.question_count} questions · {exam.candidate_count} eligible · {exam.attempt_count} attempts · {exam.duration_minutes} minutes</Text>
                  <Text style={styles.meta}>Opens {new Date(exam.starts_at).toLocaleString()} · Closes {new Date(exam.ends_at).toLocaleString()}</Text>
                  <View style={styles.actions}>
                    {exam.status==='draft'?<Btn label="Publish" onPress={()=>publish(exam)} loading={busy===exam.id} style={{flex:1}}/>:null}
                    <Btn label="Attempts and marking" onPress={()=>openAttempts(exam)} variant="outline" style={{flex:1}}/>
                  </View>
                </Card>
              ))}
              <TouchableOpacity onPress={loadExams} style={styles.refresh}><Ionicons name="refresh" size={16} color={Colors.primary}/><Text style={styles.backText}>Refresh examinations</Text></TouchableOpacity>
            </>
          )}

          {mode==='create'&&(
            <Card>
              <Text style={styles.title}>Create examination draft</Text>
              <Text style={styles.meta}>Only subject-approved questions can be selected. Publishing rechecks every candidate's lesson coverage.</Text>
              <Text style={styles.label}>Examination board</Text>
              <View style={styles.chips}>{BOARDS.map(item=><TouchableOpacity key={item} onPress={()=>chooseBoard(item)} style={[styles.chip,board===item&&styles.chipActive]}><Text style={[styles.chipText,board===item&&styles.chipTextActive]}>{item}</Text></TouchableOpacity>)}</View>
              <Text style={styles.label}>Examination class</Text>
              <View style={styles.chips}>{CLASSES.map(item=><TouchableOpacity key={item} onPress={()=>chooseClass(item)} style={[styles.chip,className===item&&styles.chipActive]}><Text style={[styles.chipText,className===item&&styles.chipTextActive]}>{item}</Text></TouchableOpacity>)}</View>
              <Text style={styles.label}>Subject</Text>
              <View style={styles.chips}>{subjects.map(item=><TouchableOpacity key={item.id} onPress={()=>chooseSubject(item)} style={[styles.chip,subject?.id===item.id&&styles.chipActive]}><Text style={[styles.chipText,subject?.id===item.id&&styles.chipTextActive]}>{item.name}</Text></TouchableOpacity>)}</View>
              <Field label="Title" value={title} onChange={setTitle} placeholder="SS 3 Mathematics Mock Examination"/>
              <Field label="Examination type" value={examType} onChange={setExamType} placeholder="Mock / Terminal / BECE / WAEC"/>
              <Field label="Instructions" value={instructions} onChange={setInstructions} multiline/>
              <Field label="Duration (minutes)" value={duration} onChange={setDuration} keyboardType="numeric"/>
              <Field label="Start time (ISO 8601)" value={startsAt} onChange={setStartsAt}/>
              <Field label="End time (ISO 8601)" value={endsAt} onChange={setEndsAt}/>
              <Text style={styles.label}>Lesson coverage — candidates must have completed this topic</Text>
              {loadingTopics?<Text style={styles.meta}>Checking candidate lesson coverage…</Text>:null}
              {!loadingTopics&&subject&&lessonTopics.length===0?<Empty message="No lesson topics were found for this class and subject."/>:null}
              <View style={styles.chips}>{lessonTopics.map(item=><TouchableOpacity key={item.id} disabled={!item.eligible_for_all_candidates} onPress={()=>setSelectedTopic(item)} style={[styles.topicChip,selectedTopic?.id===item.id&&styles.chipActive,!item.eligible_for_all_candidates&&styles.topicChipDisabled]}>
                <Text style={[styles.chipText,selectedTopic?.id===item.id&&styles.chipTextActive]}>{item.title}</Text>
                <Text style={styles.meta}>{item.completed_count}/{item.candidate_count} completed</Text>
              </TouchableOpacity>)}</View>
              {selectedTopic?<Text style={styles.notice}>Selected lesson: {selectedTopic.title}. The server rechecks every candidate before publication.</Text>:null}
              <Text style={styles.label}>Approved questions ({questions.length})</Text>
              {subject&&!questions.length?<Empty message="No approved MCQ questions are available for this board and subject. Ask an assigned subject teacher to review the question bank first."/>:null}
              {questions.map(question=>(
                <View key={question.id}>
                  <TouchableOpacity onPress={()=>toggleQuestion(question.id)} style={[styles.question,selectedQuestions[question.id]&&styles.questionSelected]}>
                    <Ionicons name={selectedQuestions[question.id]?'checkbox':'square-outline'} size={20} color={selectedQuestions[question.id]?Colors.primary:Colors.textSub}/>
                    <View style={{flex:1}}>
                      <Text style={styles.questionText}>{question.stem}</Text>
                      <Text style={styles.meta}>{question.topic} · {question.question_type} · {question.marks} marks · {question.question_number}</Text>
                    </View>
                  </TouchableOpacity>
                  {selectedQuestions[question.id]&&question.question_type!=='mcq'?(
                    <View style={styles.rubricWrap}>
                      <Field label={'Marking rubric for '+question.marks+' marks (id|description|max_marks per line)'} value={rubricInputs[question.id]??''} onChange={(value:string)=>setRubricInputs(current=>({...current,[question.id]:value}))} multiline placeholder={'method|Shows the correct method|3\nresult|States the correct result|2'}/>
                    </View>
                  ):null}
                </View>
              ))}
              <Btn label={busy==='create'?'Creating…':'Create draft'} onPress={createExam} loading={busy==='create'} disabled={busy==='create'||!selectedTopic||!questions.some(q=>selectedQuestions[q.id])} style={{marginTop:Spacing.md}}/>
            </Card>
          )}

          {mode==='attempts'&&(
            <Card>
              <Text style={styles.title}>{selectedExam?.title}</Text>
              <Text style={styles.meta}>Candidate attempts and outstanding examiner reviews.</Text>
              {attempts.length===0?<Empty message="No eligible candidates or attempts are available."/>:null}
              {attempts.map(attempt=>(
                <TouchableOpacity key={attempt.student_id} onPress={()=>attempt.attempt_id&&openResponses(attempt)} disabled={!attempt.attempt_id} style={styles.attempt}>
                  <View style={{flex:1}}>
                    <Text style={styles.questionText}>{attempt.username??attempt.student_id}</Text>
                    <Text style={styles.meta}>{attempt.status??'Not started'} · {attempt.score??'—'}/{attempt.total_marks??'—'} marks</Text>
                  </View>
                  {Number(attempt.pending_reviews)>0?<Badge label={attempt.pending_reviews+' review'} color={Colors.warning}/>:null}
                  <Ionicons name="chevron-forward" size={18} color={Colors.textSub}/>
                </TouchableOpacity>
              ))}
            </Card>
          )}

          {mode==='responses'&&(
            <Card>
              <Text style={styles.title}>{selectedAttempt?.username??'Candidate response'}</Text>
              <Text style={styles.meta}>Status: {selectedAttempt?.status??'—'} · {selectedAttempt?.score??'—'}/{selectedAttempt?.total_marks??'—'} marks</Text>
              {responses.map((response,index)=>(
                <View key={response.question_id} style={styles.response}>
                  <Text style={styles.questionText}>{index+1}. {response.stem}</Text>
                  <Text style={styles.meta}>Candidate answer: {response.options?.find((option:any)=>option.key===(response.response?.key??response.response))?.text??(typeof response.response==='string'?response.response:JSON.stringify(response.response??'No response'))}</Text>
                  {response.correct_answer?<Text style={styles.meta}>Expected answer: {typeof response.correct_answer==='string'?response.correct_answer:JSON.stringify(response.correct_answer)}</Text>:null}
                  {(response.marking_rubric??[]).map((criterion:any)=><Text key={criterion.id} style={styles.meta}>Rubric — {criterion.description}: {criterion.max_marks} marks</Text>)}
                  <Text style={styles.meta}>Marking: {response.marking_status??'unanswered'} · Awarded: {response.awarded_marks??'—'} / {response.marks}</Text>
                  {response.feedback?<Text style={styles.meta}>Feedback: {response.feedback}</Text>:null}
                  {response.marking_confidence!=null?<Text style={styles.meta}>AI confidence: {Math.round(Number(response.marking_confidence)*100)}%</Text>:null}
                  {response.marking_details?.criterion_scores?.map((item:any)=><Text key={item.criterion_id} style={styles.meta}>{item.criterion_id}: {item.points} — {item.rationale}</Text>)}
                  {response.marking_status==='pending_review'?(
                    <View style={styles.manual}>
                      <Field label={'Manual mark (max '+response.marks+')'} value={marks[response.question_id]??''} onChange={(value:string)=>setMarks(current=>({...current,[response.question_id]:value}))} keyboardType="numeric"/>
                      <Field label="Examiner feedback" value={feedback[response.question_id]??''} onChange={(value:string)=>setFeedback(current=>({...current,[response.question_id]:value}))} multiline/>
                      <Btn label={busy===response.question_id?'Saving…':'Save manual mark'} onPress={()=>markResponse(response)} loading={busy===response.question_id} disabled={busy===response.question_id}/>
                    </View>
                  ):null}
                </View>
              ))}
            </Card>
          )}
        </ScrollView>
      )}
    </View>
  );
}

function Field({label,value,onChange,placeholder,multiline=false,keyboardType='default'}:any){
  return <View style={{marginTop:Spacing.sm}}>
    <Text style={styles.label}>{label}</Text>
    <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={Colors.textSub}
      multiline={multiline} keyboardType={keyboardType} style={[styles.input,multiline&&{minHeight:88,textAlignVertical:'top'}]}/>
  </View>;
}

const styles=StyleSheet.create({
  back:{flexDirection:'row',alignItems:'center',gap:Spacing.xs,paddingVertical:Spacing.sm},
  backText:{fontSize:Fonts.sizes.sm,fontWeight:'700',color:Colors.primary},
  title:{fontSize:Fonts.sizes.md,fontWeight:'700',color:Colors.text},
  meta:{fontSize:Fonts.sizes.xs,color:Colors.textSub,marginTop:4},
  label:{fontSize:Fonts.sizes.sm,fontWeight:'700',color:Colors.text,marginTop:Spacing.md},
  row:{flexDirection:'row',alignItems:'center',gap:Spacing.sm},
  actions:{flexDirection:'row',gap:Spacing.sm,marginTop:Spacing.md},
  chips:{flexDirection:'row',flexWrap:'wrap',gap:Spacing.xs,marginTop:Spacing.xs},
  chip:{borderWidth:1,borderColor:Colors.border,borderRadius:Radius.md,paddingHorizontal:Spacing.sm,paddingVertical:Spacing.xs},
  chipActive:{borderColor:Colors.primary,backgroundColor:Colors.primary+'12'},
  chipText:{fontSize:Fonts.sizes.xs,color:Colors.text},
  chipTextActive:{color:Colors.primary,fontWeight:'700'},
  input:{borderWidth:1,borderColor:Colors.border,borderRadius:Radius.md,padding:Spacing.sm,color:Colors.text,backgroundColor:Colors.white,minHeight:42},
  question:{flexDirection:'row',alignItems:'flex-start',gap:Spacing.sm,borderWidth:1,borderColor:Colors.border,borderRadius:Radius.md,padding:Spacing.sm,marginTop:Spacing.sm},
  questionSelected:{borderColor:Colors.primary,backgroundColor:Colors.primary+'08'},
  rubricWrap:{marginLeft:Spacing.lg,marginTop:Spacing.xs},
  topicChip:{borderWidth:1,borderColor:Colors.border,borderRadius:Radius.md,padding:Spacing.sm,marginTop:Spacing.xs,maxWidth:'100%'},
  topicChipDisabled:{opacity:0.45},
  questionText:{fontSize:Fonts.sizes.sm,fontWeight:'700',color:Colors.text,lineHeight:20},
  attempt:{flexDirection:'row',alignItems:'center',gap:Spacing.sm,borderTopWidth:1,borderTopColor:Colors.border,paddingVertical:Spacing.md},
  response:{borderTopWidth:1,borderTopColor:Colors.border,paddingTop:Spacing.md,marginTop:Spacing.md},
  manual:{marginTop:Spacing.sm,padding:Spacing.sm,backgroundColor:Colors.background,borderRadius:Radius.md},
  refresh:{flexDirection:'row',alignItems:'center',gap:Spacing.xs,justifyContent:'center',padding:Spacing.md},
  error:{color:Colors.error,fontSize:Fonts.sizes.sm},
  notice:{color:Colors.success,fontSize:Fonts.sizes.sm},
});
