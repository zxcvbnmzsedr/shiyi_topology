import React, {useEffect, useState} from 'react';
import {useHistory} from "umi";

import QuestionDetail from './components/questionDetail'
import G6Graph from "./g6";
import styles from "./index.less";


const Page = (props) => {
  const history = useHistory();
  const [id, setId] = useState(props.match?.params?.id);


  useEffect(() => {
    if (props.match?.params?.id) {
      setId(props.match.params.id);
    }
  }, [props.match?.params?.id])

  const changeId = (selectId) => {
    if (selectId){
      history.push(`/detail/${selectId}.html`);
    }else {
      history.push(`/detail`);
    }
    setId(selectId)
  }
  if (!id){
    return <G6Graph changeId={changeId} id={id}/>
  }
  return <div className={styles.box}>
    <div className={styles.content}>
      {!!id && (
        <QuestionDetail key={id} id={id}/>
      )}
    </div>
    <div className={styles.chart}>
      <G6Graph changeId={changeId} id={id}/>
    </div>
  </div>
};

export default Page;
