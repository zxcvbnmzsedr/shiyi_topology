import {Modal} from 'antd';

import {queryNode} from "../../../services/chart/api";
import React from "react";
import styles from "../index.less";
import {Autocomplete} from "../../../components/search/Autocomplete";

const Search = ({changeId, onSelect, visible, onConfirm, ...rest}) => {

  return <Modal
    {...rest}
    footer={null}
    closeIcon={<div/>}
    destroyOnClose
    visible={visible}
    className={styles.modal}
  >
    <Autocomplete
      debug={true}
      placeholder={"✎...一期一会，世当珍惜～"}
      autoFocus
      detachedMediaQuery='none'
      queryNode={queryNode}
      onSelect={onSelect}
    />
  </Modal>
}


export default Search;
