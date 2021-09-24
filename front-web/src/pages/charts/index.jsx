import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from "umi";

import QuestionDetail from './compents/questionDetail'
import G6Graph from "./g6";
import styles from "./index.less";


const Page = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [id, setId] = useState(location.query.id);


  useEffect(() => {
    if (location.query.id) {
      setId(location.query.id);
    }
  }, [location.query])

  const changeId = (id) => {
    setId(id)
    history.push({
      query: {
        id: id
      }
    });
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
