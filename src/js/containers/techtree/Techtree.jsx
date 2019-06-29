import React, { useEffect, useState } from 'react'
import techtreeSchemas from 'js/techtree'
import _ from 'lodash'
import ScrollHorizontal from 'react-scroll-horizontal'
import { withRouter } from 'react-router'
import { Badge, Tabs, Table, Select } from 'antd'

const Techtree = props => {
  const [researched, setResearch] = useState([0])
  const [language, setLanguage] = useState('en')
  const [techtreeSchema, setTechTreeSchema] = useState(techtreeSchemas['en'])

  const updateUrl = () => {
    let data = {
      language: language,
      researched: researched
    }
    let url = Buffer.from(JSON.stringify(data), 'ascii').toString('base64')
    props.history.push(url)
  }
  const updateLanguage = lang => {
    setLanguage(lang)
    setTechTreeSchema(techtreeSchemas[lang])
  }

  const restore = data => {
    let decode = JSON.parse(Buffer.from(data, 'base64').toString('ascii'))
    setResearch(decode.researched)
    updateLanguage(decode.language)
  }

  const cancelResearch = id => {
    let toCancel = [id]
    let queue = [id]
    while (queue.length) {
      let now = queue.shift()
      _.forEach(techtreeSchema, (tech, id) => {
        if (tech.Parent === now && researched.indexOf(id) !== -1) {
          queue.push(id)
          toCancel.push(id)
        }
      })
    }
    let next = []
    _.forEach(researched, id => {
      if (toCancel.indexOf(id) === -1) next.push(id)
    })
    setResearch(next)
  }

  const addResearch = id => {
    let toAdd = [id]
    while (1) {
      let source = techtreeSchema[toAdd[toAdd.length - 1]].Parent
      if (researched.indexOf(source) === -1) {
        toAdd.push(source)
      } else {
        break
      }
    }
    setResearch([...researched, ..._.reverse(toAdd)])
  }

  const toggleResearch = id => {
    if (id === 0) return
    if (researched.indexOf(id) !== -1) {
      cancelResearch(id)
    } else {
      addResearch(id)
    }
  }

  useEffect(() => {
    let data = props.history.location.pathname.substr(1)
    if (data) {
      restore(data)
    }
  }, [])
  useEffect(() => {
    updateUrl()
  }, [researched])
  const config = {
    width: 300,
    height: 60,
    spaceX: 100,
    spaceY: 10,
    marginX: 650,
    marginY: 0
  }
  const drawLine = (tech, id) => {
    if (!(tech.Parent >= 0)) return null
    const target = tech
    const source = techtreeSchema[target.Parent]
    const p1 = {
      x:
        source.X * (config.width + config.spaceX) +
        config.marginX +
        config.width +
        3,
      y:
        source.Y * (config.height + config.spaceY) +
        config.marginY +
        config.height * 0.5
    }
    const p2 = {
      x: target.X * (config.width + config.spaceX) + config.marginX,
      y:
        target.Y * (config.height + config.spaceY) +
        config.marginY +
        config.height * 0.5
    }
    const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
    const higher = p1.y > p2.y
    const cos =
      (p2.x - p1.x) /
      Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
    return (
      <div
        key={id}
        style={{
          position: 'absolute',
          margin: 0,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderImage:
            'linear-gradient(to right, #ffffff00 0%,#ffffff00 49.9%,#000000 50%,#000000 100%) 1',
          width: `${dist * 2}px`,
          left: `${p1.x - dist}px`,
          top: `${p1.y}px`,
          transform: `rotateZ(${(higher ? -1 : 1) *
            Math.acos(cos) *
            (180 / Math.PI)}deg)`
        }}
      />
    )
  }
  const drawBox = (tech, id) => (
    <div
      key={id}
      style={{
        width: `${config.width}px`,
        height: `${config.height}px`,
        left: `${tech.X * (config.width + config.spaceX) + config.marginX}px`,
        top: `${tech.Y * (config.height + config.spaceY) + config.marginY}px`,
        position: 'absolute',
        borderColor: 'brown',
        borderRadius: '10px',
        border: 'Solid',
        cursor: 'pointer',
        backgroundColor:
          researched.indexOf(id) !== -1 ? 'lightgreen' : 'inherit'
      }}
      onClick={() => toggleResearch(id)}
    >
      <Badge count={researched.indexOf(id) + 1}>
        <div
          style={{
            width: `${config.width}px`,
            height: `${config.height}px`
          }}
        >
          <div
            style={{
              textAlign: 'center',
              textDecoration: 'underline',
              fontWeight: 'bold'
            }}
          >
            {tech.Cost > 0 ? `${tech.Name} (${tech.Cost})` : tech.Name}
          </div>
          <div
            style={{
              padding: '2px'
            }}
          >
            {_.map(tech.Tooltip, (tooltip, id) => (
              <div key={id}>{tooltip}</div>
            ))}
          </div>
        </div>
      </Badge>
    </div>
  )

  const renderPanel = () => {
    const columns = [
      {
        title: 'Index',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Effect',
        dataIndex: 'effect',
        key: 'effect'
      },
      {
        title: 'Cost',
        dataIndex: 'cost',
        key: 'cost'
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total'
      }
    ]
    const generateSource = list => {
      let re = []
      _.forEach(list, (researchID, index) => {
        re.push({
          key: index,
          id: researchID,
          name: techtreeSchema[researchID].Name,
          effect: techtreeSchema[researchID].Tooltip,
          cost: techtreeSchema[researchID].Cost,
          total:
            (re.length ? re[re.length - 1].total : 0) +
            techtreeSchema[researchID].Cost
        })
      })
      return re
    }
    return (
      <div
        style={{
          width: '600px',
          height: '100vh',
          position: 'absolute',
          zIndex: 999,
          backgroundColor: 'white',
          border: '1px solid',
          padding: '15px',
          borderRadius: '10px',
          boxSizing: 'border-box'
        }}
      >
        <Tabs>
          <Tabs.TabPane tab={<span>Order</span>} key="1">
            <Table
              pagination={false}
              columns={columns}
              scroll={{
                y: `calc(100vh - 150px)`
              }}
              dataSource={generateSource(researched)}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span>Sort</span>} key="2">
            <Table
              pagination={false}
              columns={columns}
              scroll={{
                y: `calc(100vh - 150px)`
              }}
              dataSource={generateSource([...researched].sort((a, b) => a - b))}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
  const renderLanguage = () => {
    return (
      <div
        style={{
          width: '100px',
          height: '50px',
          top: '0px',
          right: '0px',
          position: 'absolute',
          zIndex: 999,
          backgroundColor: 'white'
        }}
      >
        <Select
          style={{
            width: '100%'
          }}
          value={language}
          onChange={value => updateLanguage(value)}
        >
          {_.map(_.keys(techtreeSchemas), (lang, id) => (
            <Select.Option key={lang} val={lang}>
              {lang}
            </Select.Option>
          ))}
        </Select>
      </div>
    )
  }
  const renderAbout = () => {
    return (
      <div
        style={{
          bottom: '0px',
          right: '0px',
          position: 'absolute',
          zIndex: 999,
          backgroundColor: 'white',
          padding: '5px'
        }}
      >
        Github:
        <a href="https://github.com/Tocknicsu/TheyAreBillionsTechTree">
          https://github.com/Tocknicsu/TheyAreBillionsTechTree
        </a>
      </div>
    )
  }

  return (
    <div
      style={{
        margin: '0 12px',
        height: '100vh',
        padding: '0 12px'
      }}
    >
      {renderPanel()}
      {renderLanguage()}
      {renderAbout()}
      <ScrollHorizontal
        style={{
          height: '100vh'
        }}
        config={{ stiffness: 200 }}
        reverseScroll={true}
      >
        <div
          style={{
            height: '12px',
            width: `${(_.maxBy(techtreeSchema, tech => tech.X).X + 1) *
              (config.width + config.spaceX) +
              config.marginX}px`
          }}
        />

        {_.map(techtreeSchema, (tech, id) => drawBox(tech, id))}
        {_.map(techtreeSchema, (tech, id) => drawLine(tech, id))}
      </ScrollHorizontal>
    </div>
  )
}

export default withRouter(Techtree)
