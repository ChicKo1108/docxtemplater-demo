import { saveAs } from 'file-saver';
import { generateDocxFile } from './utils/generate-docx';

const fileData = {
  intro: '国际劳动节，又称五一国际劳动节、劳动节、国际示威游行日，是纪念工人和劳工运动的斗争和成果的日子。国际劳动节是一项由国际劳工运动所推动的节日，全世界劳工和工人阶级在一般会在五朔节（5月1日）举行的庆祝节日，而美国和加拿大在9月第一个星期一举行。是世界上80多个国家的劳动节。',
  activities: [
    {
      name: '阿尔及利亚',
      activity: '在阿尔及利亚，5月1日是公共假日，以庆祝劳动节。'
    },
    {
      name: '安哥拉',
      activity: '5月1日在安哥拉被承认为公共假日，称为劳动节。'
    },
    {
      name: '埃及',
      activity: '在埃及，5月1日被称为劳动节，是一个带薪的公共假期。在传统上，埃及总统会主持正式的五一节庆祝活动。'
    },
    {
      name: '加纳',
      activity: '5月1日是加纳的一个节日，属于庆祝全国所有工人。工会和劳工协会以游行的形式来庆祝劳动节。加纳也会举行阅兵式，通常由工会大会秘书长和各地区的区域秘书致辞。来自不同工作地点的工人通过条幅和衣着表明他们的公司。'
    }
  ]
}

function App() {

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const out = await generateDocxFile(file, fileData);
    saveAs(out, `${new Date().getTime()}.docx`);
  }

  return (
    <div className="App">
      <input type="file" onChange={handleFileChange} />
    </div>
  )
}

export default App
