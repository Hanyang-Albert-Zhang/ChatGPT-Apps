'use client';
import React,{createContext,useCallback,useContext,useEffect,useRef,useState} from 'react';
import {Language,languageOf,translate} from './locale-core';
const LocaleContext=createContext<{language:Language;setLanguage:(language:Language)=>void}>({language:'en',setLanguage:()=>{}});
const VerbatimContext=createContext(false);
export function LocaleProvider({children}:{children:React.ReactNode}){
 const [language,setLanguageState]=useState<Language>('en'),[ready,setReady]=useState(false),changed=useRef(false);
 const setLanguage=useCallback((next:Language)=>{changed.current=true;setLanguageState(next);try{const url=new URL(window.location.href);if(url.searchParams.has('lang')){url.searchParams.delete('lang');window.history.replaceState(window.history.state,'',url);}}catch{}try{localStorage.setItem('seediva-language',next);}catch{}},[]);
 useEffect(()=>{let active=true;let saved:Language='en',preview:Language|null=null;try{const requested=new URLSearchParams(window.location.search).get('lang');if(requested&&['en','zh-CN','es'].includes(requested))preview=languageOf(requested);saved=preview||languageOf(localStorage.getItem('seediva-language'));setLanguageState(saved);}catch{}fetch('/api/account').then(r=>r.json()).then((data:any)=>{if(active&&!changed.current){const next=preview||(data.user?languageOf(data.user.language):saved);setLanguageState(next);if(!preview)try{localStorage.setItem('seediva-language',next);}catch{}}}).catch(()=>{}).finally(()=>{if(active)setReady(true);});return()=>{active=false;};},[]);
 useEffect(()=>{document.documentElement.lang=language;document.title=translate('Seediva — Nutrition & Training',language);},[language]);
 return <LocaleContext.Provider value={{language,setLanguage}}>{ready?children:<div className="locale-loading" aria-busy="true" role="status">{translate('Loading…',language)}</div>}</LocaleContext.Provider>;
}
export function useLocale(){const context=useContext(LocaleContext);return {...context,t:(s:string)=>translate(s,context.language)};}
function translateChildren(children:React.ReactNode,language:Language):React.ReactNode{if(typeof children==='string')return translate(children,language);if(Array.isArray(children))return children.map(v=>translateChildren(v,language));if(React.isValidElement<{children?:React.ReactNode}>(children)&&children.type===React.Fragment)return React.cloneElement(children,undefined,translateChildren(children.props.children,language));return children;}
type Elements={[K in keyof React.JSX.IntrinsicElements]:React.ComponentType<React.JSX.IntrinsicElements[K]>};
function localizedTag(tag:string){
 function LocalizedElement(props:any){const {language}=useLocale(),parentVerbatim=useContext(VerbatimContext),verbatim=parentVerbatim||props['data-user-content']||props.translate==='no';const next={...props};
  if(!verbatim){for(const key of ['placeholder','aria-label','title','alt'])if(typeof next[key]==='string')next[key]=translate(next[key],language);}
  if(tag==='option'&&next.value===undefined){const raw=Array.isArray(props.children)?props.children.join(''):props.children;if(typeof raw==='string'||typeof raw==='number')next.value=raw;}
  const children=verbatim?props.children:translateChildren(props.children,language);
  const element=React.createElement(tag,next,children);
  return verbatim&&!parentVerbatim?<VerbatimContext.Provider value={true}>{element}</VerbatimContext.Provider>:element;
 }
 LocalizedElement.displayName='Localized('+tag+')';return LocalizedElement;
}
const tags=['animate','em','progress','fieldset','source','a','article','aside','audio','b','br','button','circle','clipPath','defs','details','div','ellipse','figcaption','figure','footer','form','g','h1','h2','h3','h4','header','hr','i','iframe','img','input','label','legend','li','line','main','nav','ol','option','p','path','pattern','polygon','polyline','rect','section','select','small','span','stop','strong','summary','svg','table','tbody','td','text','textarea','th','thead','time','title','tr','tspan','ul','video','linearGradient','radialGradient','mask'];
export const UI=Object.fromEntries(tags.map(tag=>[tag,localizedTag(tag)])) as Elements;
