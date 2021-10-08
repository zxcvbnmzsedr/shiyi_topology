import React from 'react';
import Page from './charts'
import styles from './Welcome.less'
import {Input} from "antd";
import {Router} from "umi";

const { Search } = Input;

export default () => {
  return (
    <div>
      {/*<div className={styles.banner}>*/}
      {/*  <div>*/}
      {/*    <div className={styles.bannerItem}>*/}
      {/*      <div className={styles.bannerText}>*/}
      {/*        <span className={styles.logo} />*/}

      {/*        <Search*/}
      {/*          className={styles.searchItem}*/}
      {/*          placeholder="✎...一期一会，世当珍惜～"*/}
      {/*          onSearch={(value) => Router.push(`/search?q=${value}`)}*/}
      {/*        />*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      <Page/>

    </div>


  );
};
