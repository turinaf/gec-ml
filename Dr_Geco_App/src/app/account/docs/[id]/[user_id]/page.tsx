"use client"
import React,{useRef, useEffect, useState} from "react"
import styles from './docs.module.scss'
import useDocument from "@/app/hooks/useDocument"
import Loading from "@/app/components/Loading"
import { HandleSaveDocument } from "@/app/helpers/SaveDocument"
import ContentEditable from 'react-contenteditable'
import TextCustomBar from "./components/TextCustomBar"
import Link from "next/link"
import SidebarDocument from "./components/SidebarDocument"
import {AnimatePresence} from 'framer-motion'
import { HandleCheckText } from "@/app/helpers/CheckText"
import CorrectText from "./components/CorrectText"
import CircularProgress from '@mui/material/CircularProgress'
import { HandleCheckWord } from "@/app/helpers/CheckSynonyms"
import SynonymsWords from "./components/SynonymsWords"
import { DocumentContext } from "./context/DocumentContext"
import { HandleTranslateText } from "@/app/helpers/TranslateText"
import TranslateText from "./components/TranslateText"
import useAuth from "@/app/hooks/useAuth"

interface DocsProps {
  params: {
    id: string
    user_id: string
  }
}

const Doc: React.FC<DocsProps>= ({params}) => {
  const {isLogged}=useAuth()
  const {document,error,isLoading,setDocument} = useDocument(params.user_id,params.id)
  const [text,setText]:[undefined | string | Element, React.Dispatch<React.SetStateAction<undefined | string | Element>>] = useState()
  const [textSuggest,setTextSuggest]:[undefined | string, React.Dispatch<React.SetStateAction<undefined | string >>] = useState()
  const [wordSuggest,setWordSuggest]:[undefined | string, React.Dispatch<React.SetStateAction<undefined | string >>] = useState()
  const [wordToCheck,setWordToCheck]:[undefined | string, React.Dispatch<React.SetStateAction<undefined | string >>] = useState()
  const [translateText,setTranslateText]:[boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [correct, setCorrect]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [correctLoading,setCorrectLoading]:[boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [synonymsLoading,setSynonymsLoading]:[boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [translateLoading,setTranslateLoading]:[boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [title,setTitle]:[undefined | string, React.Dispatch<React.SetStateAction<undefined | string>>] = useState()
  const textRef = useRef<any>(null)
  const [isSidebar,setIsSidebar]=useState(false)

  useEffect(()=>{
    setText(document?.text)
    setTitle(document?.title)
  },[document])

  useEffect(() => {
    //what to do with correct? since the text has
      HandleSaveDocument(params.user_id,params.id,title as string,text as string)
  },[text,title,correct])

  const handleCorrection = (): void => {
    console.log(textSuggest)
    HandleCheckText(text as string,document?.language as string,setTextSuggest,setCorrect,setCorrectLoading,params.user_id)
  }

  const handleSynonyms = ():void=>{
    HandleCheckWord(wordToCheck as string,document?.language as string,setWordSuggest,setSynonymsLoading,params.user_id)
  }

  const handleTranslate=():void=>{
    HandleTranslateText(text as string,document?.language as string,setTranslateLoading,setText,setTranslateText,params.user_id)
}

  const handleChange = (evt:any) => {
    setText(evt.target.value);
  };

  const handleDoubleClick=():void=>{
    setWordToCheck(window.getSelection()?.toString())
  }

  if (isLoading && !document) return <Loading />

  if (error) return <div>{error}</div>

  if (!isLogged) return <div>You are not authorized</div>

  if (document) return (
    <div className={styles.doc}>
      <DocumentContext.Provider value={{document:document,setDocument:setDocument}}>
      <AnimatePresence>{isSidebar && (<SidebarDocument setIsSidebar={setIsSidebar} textRef={textRef} title={title as string} />)}</AnimatePresence>
      <div className={styles.doc__sidebar__nav}>
        <Link href='/account'><svg className={styles.nav__logo} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"/></svg></Link>
        <svg onClick={()=>setIsSidebar(true)} className={styles.nav__bars} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
      </div>
      <div className={styles.doc__document}>
        <input type="text" className={styles.doc__document__title} placeholder={title} onChange={(e)=>setTitle(e.target.value)}/>
        <TextCustomBar textRef={textRef}/>
        <ContentEditable
              onDoubleClick={handleDoubleClick}
              id="content"
              innerRef={textRef}
              html={text ? (text as string) : ''}   
              onChange={(e)=>handleChange(e)} 
              data-placeholder='Type or paste (Ctrl + V ) your text here or upload from document'
              className={styles.doc__document__text}
            />
      </div>
      <div className={styles.doc__suggestions}>
        <h5 className={styles.doc__suggestions__title}>Suggestions from Dr. Geco</h5>
        <button title="Click To Check Grammar" onClick={handleCorrection} className={styles.doc__suggestions__btn__red}>Click here to Check Correctness</button>
        {/* <button title="Double Click Word And Check" onClick={handleSynonyms} className={styles.doc__suggestions__btn}>Check Synonyms</button>
        <button title="Click To Translate Text To Your Selected Language" onClick={handleTranslate} className={styles.doc__suggestions__btn__green}>Translate to Your Language</button> */}
        <div className={styles.doc__suggestions__active}>
          {/* {synonymsLoading ?  <CircularProgress style={{margin: '5rem auto 1rem auto'}}/> : wordSuggest && <SynonymsWords text={wordSuggest} setWordSuggest={setWordSuggest}/>}
          {translateLoading ?  <CircularProgress style={{margin: '5rem auto 1rem auto'}}/> : translateText && <TranslateText language={document.language} setTranslate={setTranslateText}/>} */}
            {correctLoading ?
              <CircularProgress style={{ margin: '5rem auto 1rem auto' }} />
              :
              (!correct
                ?
                <><img className={styles.doc__suggestions__active__img} src="https://baza-wiedzy.bhpin.pl/wp-content/uploads/2023/05/undraw_My_password_re_ydq7.png" alt="correct" /><h5 className={styles.doc__suggestions__active__message}>No Corrections needed! Your sentences are great!</h5></>
                :
                <CorrectText text={textSuggest as string} mistakeText={text as string} setMistakeText={setText} setCorrect={setCorrect} setText={setTextSuggest} />)}
        </div>
      </div>
      </DocumentContext.Provider>
    </div>
  )
}

export default Doc