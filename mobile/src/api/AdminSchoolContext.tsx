import React,{createContext,useContext,useState,useEffect,useCallback}from'react';
import api from'./client';import{useAuth}from'./AuthContext';
export interface School{id:number;code:string;name:string}
interface AdminSchoolState{schools:School[];selectedSchoolCode:string|null;selectedSchool:School|null;loading:boolean;selectSchool:(code:string)=>void;refreshSchools:()=>Promise<void>}
const AdminSchoolContext=createContext<AdminSchoolState>({}as AdminSchoolState);export const useAdminSchool=()=>useContext(AdminSchoolContext);
/** School choice is session-local and intentionally has no persisted/default selection. */
export function AdminSchoolProvider({children}:{children:React.ReactNode}){
 const{user}=useAuth();const[schools,setSchools]=useState<School[]>([]);const[selectedSchoolCode,setSelectedCode]=useState<string|null>(null);const[loading,setLoading]=useState(false);
 const refreshSchools=useCallback(async()=>{if(user?.role!=='admin'&&user?.role!=='finance_admin'){setSchools([]);setSelectedCode(null);setLoading(false);return;}setLoading(true);try{const{data}=await api.get('/academic/schools');setSchools(Array.isArray(data.schools)?data.schools:[]);}catch{setSchools([]);}finally{setLoading(false);}},[user?.id,user?.role]);
 useEffect(()=>{setSelectedCode(null);delete (api.defaults.headers.common as any)['x-school-code'];void refreshSchools();},[user?.id,user?.role,refreshSchools]);
 useEffect(()=>{if(user?.role==='admin'&&selectedSchoolCode){(api.defaults.headers.common as any)['x-school-code']=selectedSchoolCode;}else{delete (api.defaults.headers.common as any)['x-school-code'];}},[user?.role,selectedSchoolCode]);
 const selectSchool=useCallback((code:string)=>{if(schools.some(s=>s.code===code))setSelectedCode(code);},[schools]);const selectedSchool=schools.find(s=>s.code===selectedSchoolCode)??null;
 return <AdminSchoolContext.Provider value={{schools,selectedSchoolCode,selectedSchool,loading,selectSchool,refreshSchools}}>{children}</AdminSchoolContext.Provider>;
}
