import React, {useState} from 'react';
import './style.css'
import {Input} from "antd";
import {CloseOutlined, SearchOutlined} from "@ant-design/icons";
import {useRequest} from "umi";
import {ProductItem} from "./ProductItem";

export function Autocomplete({onSelect, queryNode, placeholder}) {
  const [searchText, setSearchText] = useState(null)
  const {data, run} = useRequest(queryNode, {
    throttleInterval: 500,
    manual: true,
  });

  const handleQuery = (e) => {
    run(e.target.value)
    setSearchText(e.target.value)
  }
  const handleResult = () => {
    if (data.length === 0) {
      return <div className="aa-SourceNoResults">
        <div>
          查不到结果: <b>{searchText}</b>
        </div>
      </div>
    }
    return <ul className="aa-List">
      {

        data?.map((item) => {
          return <li className="aa-Item" key={item.id}>
            <ProductItem hit={item} onClick={onSelect}/>
          </li>
        })
      }
    </ul>
  }


  return <div>
    <div className="aa-Autocomplete">
      <form className="aa-Form">
        <div className="aa-InputWrapperPrefix">
          <label className="aa-Label">
            <button className="aa-SubmitButton" type="submit" title="Submit">
              <SearchOutlined/>
            </button>
          </label>
        </div>
        <div className="aa-InputWrapper">
          <Input onChange={handleQuery} autoFocus bordered={false} size={"large"} placeholder={placeholder}
                 className="aa-Input"/>
        </div>
        <div className="aa-InputWrapperSuffix">
          <button className="aa-ClearButton" type="reset" title="Clear" hidden="">
            <CloseOutlined/>
          </button>
        </div>
      </form>
    </div>
    {data ? <div className="aa-Panel"
                 style={{width: '100%'}}>
      <div className="aa-PanelLayout aa-Panel--scrollable">
        <section className="aa-Source" data-autocomplete-source-id="predictions">
          {handleResult}
        </section>
      </div>
      <div className="aa-GradientBottom"/>
    </div> : null
    }

  </div>
}
