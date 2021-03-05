import './index.css'
import {IconContext} from 'react-icons'
import {FaFolder, FaFile} from 'react-icons/fa'


/** 
 * 
 * @param {Object} props
 * @param {Object} props.direntObj
 * @param {string} props.direntObj.name
 * @param {boolean} props.direntObj.isDirectory
 * @param {string} props.direntObj.path
 * @param {Object} props.stateSetters
 * @param {Function} props.stateSetters.setDirents
 * @param {Function} props.stateSetters.setPath
 * @param {Function} props.stateSetters.setHistory
 * @param {Object} props.stateVariables
 * @param {[]} props.stateVariables.dirents
 * @param {string} props.stateVariables.prevPath
 * @param {string[]} props.stateVariables.history
 * @param {Object} props.iconsObj
 * @param {JSX.Element} props.iconsObj.extension
 */

function Dirent({direntObj, stateSetters, stateVariables, iconsObj}) {
    //console.log(direntObj)
    const {name, isDirectory, path, active} = direntObj
    const { dirents, prevPath, history} = stateVariables
    const {setDirents, setPath, setHistory} = stateSetters

    let fileIcon;
    const nameParts = name.split('.')
    const extension = nameParts[nameParts.length - 1]
    if(iconsObj && iconsObj[extension.toLowerCase()]) {
        fileIcon = (
            <IconContext.Provider value={{className : 'mr-3 dirent-file-icon'}}>
                {iconsObj[extension.toLowerCase()]}
            </IconContext.Provider>
            )
    }
    else {
        fileIcon = (<FaFile className="mr-3 dirent-file-icon"/>)
    }

    const setActive = () => {
        setDirents(dirents.map((val) => {
            return (
                val.path === path ?
                {name : val.name, isDirectory : val.isDirectory, path : val.path, active : true} :
                {name : val.name, isDirectory : val.isDirectory, path : val.path, active : false}
            )
        }))
    }

    const handleDblClick = () => {
        if(isDirectory) {
            let hist = history;
            if(hist.indexOf(prevPath) > -1) {
                hist = hist.slice(0,hist.indexOf(prevPath)+1)
                hist.push(path);
                setHistory(hist);
            }
            if(hist.indexOf(path) === -1) {
                hist.push(path);
                setHistory(hist);
            }
            setPath(path)
        }
    }
    return (
        isDirectory ?
        <div className="dirent dir" onDoubleClick ={handleDblClick}><FaFolder className="mr-3 dirent-dir-icon"/> <div>{name}</div></div> :
        <div className={`dirent file ${active ? 'dirent-active' : ''}`} onClick = {setActive}> {fileIcon} <div>{name}</div></div>
    )
}

export default Dirent;

