import React, { useState, useEffect, useRef} from 'react'
import { AnimatePresence, motion} from 'framer-motion';
import { useSnapshot} from 'valtio';




import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader} from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes} from '../config/constants';
import { fadeAnimation, slideAnimation} from '../config/motion';
import{ ColorPicker, CustomButton,FilePicker,Tab} from '../components';
import CanvasModel from '../canvas/Canvas';

const Customizer = () => {

  const handleScreenshot = () => {
    const canvas = canvasRef.current;
    downloadCanvasToImage(canvas); // Assuming you have implemented the downloadCanvasToImage function
  };

  //states
  const snap = useSnapshot(state);
  const  [file, setFile] = useState('');
  const  [prompt, setprompt] = useState('');
  const  [generatingImg, setgeneratingImg] = useState(false);
  const [activeEditorTab, setactiveEditorTab] = useState('');
  const [activeFilterTab, setactiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  })
  const canvasRef = useRef(null);

  // show tab content depending on the activeTab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case 'colorpicker':
        return <ColorPicker/>
        break;
      case 'filepicker':
        return <FilePicker
          file={file}
          setFile = {setFile}
          readFile={readFile}
        />
        break  
      default:
        return null;    
    }
  }

  

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    
    state[decalType.stateProperty] = result;

    if(!activeFilterTab[decalType.FilterTabs]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case 'logoShirt':
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case 'stylishShirt':
        state.isFullTexture = !activeFilterTab[tabName];
      case 'download':
        break       
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
    }

    // after setting the state, activeFilterTab is updated

    setactiveFilterTab((prevState) => {
    return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    reader(file)
      .then((result) => {
          handleDecals(type, result);
          setactiveFilterTab("");
      })
  }


  return (
    <AnimatePresence >
       {!snap.intro && (
          <>
            <motion.div
              key="custom"
              className="absolute top-0 z-10"
              {...slideAnimation("left")}

            >
              <div className="flex items-center min-h-screen">
                <div className="editortabs-container tabs">
                  {EditorTabs.map((tab) => (
                    <Tab
                      key={tab.name}
                      tab={tab}
                      handleClick={() => {
                          setactiveEditorTab(tab.name)
                      }}
                    />
                  ))}

                  {generateTabContent()}
                </div>
              </div>
            </motion.div>

            <motion.div
                 className="absolute z-10 top-5 right-5"
                 {...fadeAnimation}
            >
              <CustomButton
                type="filled"
                title="Go Back"
                handleClick={() => state.intro = true}
                customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              />

            </motion.div>

            <motion.div
              className='filtertabs-container'
              {...slideAnimation('up')}
            >

              {FilterTabs.map((tab) => (
                <Tab
                  key={tab.name}
                  tab={tab}
                  isFilterTab
                  isActiveTab={activeFilterTab[tab.name]}
                  handleClick={() => handleActiveFilterTab(tab.name)}
                />
              ))}
              <button onClick={handleScreenshot}>Take Screenshot</button>

            </motion.div>
          </>
       )

       }
    </AnimatePresence>
  )
}

export default Customizer