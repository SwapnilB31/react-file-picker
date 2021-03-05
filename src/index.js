import './index.css';
import {FaArrowLeft, FaArrowRight} from 'react-icons/fa';
import React, { useState, useEffect} from 'react';
import Dirent from './Dirent';
import {v4 as uuid} from 'uuid';

/**
 * 
 * @param {Object} props - props to react functional component
 * @param {boolean} props.show - a state representing whether the file-picker is shown or not
 * @param {Function} props.setShow - a function that sets the value of show
 * @param {Function} props.scanDir - async ScanDir(path : string) - takes a path anc returns an array of objects of the shape {name : string, isDirectory : boolean, path : string}
 * @param {Function} props.setSelectedPath - a method that can set the value of an element to the path of the file selected by the user in the file-picker
 * @param {string[]} props.filters - (optional) string array with file extensions (e.g. doc, pdf) that is used to filter the results shown by the file picker.
 * @param {Object} props.iconsObj - (optional) file icons for specific file types can be defined as a JS object that will be shown in the file-picker ui. They key should be a string with the extension type and the value should be a react icon
 * @param {JSX.Element} props.iconsObj.extension 
 * 
     
 }} 
 */ 

function FilePicker({show,setShow,scanDir,setSelectedPath, filters, iconsObj}) {

    let direntArray = [];

    const filterSet = filters ? new Set(filters.map((val) => val.toLowerCase())) : new Set([]);

    const [path,setPath] = useState('/')
    const [dirents,setDirents] = useState([]);
    const [backNavActive,setBackNavActive] = useState(false);
    const [forwNavActive,setForwNavActive] = useState(false);
    const [history,setHistory] = useState([]);

   

    useEffect(() => {
        const fetchDirentData = async () => {
            try {
                let queryPath = path === "/" ? "/" : `${path}`
                queryPath = queryPath.replace('//','/')
                direntArray = await scanDir(queryPath);
                if(history.length === 0)
                    setHistory(["/"]);
                setStateNavButtons();
                direntArray = direntArray.map((val) => (
                    {
                        name : val.name, 
                        isDirectory : val.isDirectory, 
                        path : val.path, 
                        active : false
                    }
                ))

                if(filters) {
                    direntArray = direntArray.filter(function(val){
                        if(!val.isDirectory) {
                        const nameParts = val.name.split(".")
                        const ext = nameParts[nameParts.length - 1];

                        return filterSet.has(ext.toLowerCase())
                        }
                        return true
                    })
                }
                
                direntArray = direntArray.sort(function(a,b) {
                    if(a.isDirectory && b.isDirectory)
                        return 0
                    else if(a.isDirectory && !b.isDirectory)
                        return -1
                    else if(!a.isDirectory && b.isDirectory)
                        return 1
                    else
                        return a.name.localeCompare(b.name)
                })

                setDirents(direntArray)
            } catch(err) {
                console.warn(err)
            }
        }
        fetchDirentData()
    },[path])

    const setAllDirentsInActive = () => {
        setDirents(dirents.map((val) => {
            return (
                {name : val.name, isDirectory : val.isDirectory, path : val.path, active : false}
            )
        }))
    }


    const setStateNavButtons = ()=> {
        let hist = history;
        let pathAlias = path;

        const pathInd = hist.indexOf(pathAlias)

        if(pathInd > 0 && pathInd < hist.length - 1) {
            setBackNavActive(true);
            setForwNavActive(true);
        }

        if(hist.length > 1 && pathInd === 0) {
            setBackNavActive(false);
            setForwNavActive(true)
        }

        if(hist.length > 1 && pathInd === hist.length - 1) {
            setBackNavActive(true);
            setForwNavActive(false);
        }

        if(pathInd === 0 && hist.length === 1) {
            setBackNavActive(false);
            setForwNavActive(false);
        } 
            
    }

    function goBack() {
        if(backNavActive) {
           const lastPath = history.indexOf(path) - 1;
           setPath(history[lastPath]) 
        }
    }

    function goForward() {
        if(forwNavActive) {
            const nextPath = history.indexOf(path) + 1;
            setPath(history[nextPath]);
        }
    }

    function cleanAllNavs() {
        setPath("/")
        setHistory([])
        setBackNavActive(false)
        setForwNavActive(false)
    }

    function returnSelectedPath() {
        let selectedDirent = dirents.find(function(dirent) {return dirent.active})
        if(selectedDirent && selectedDirent.path) {
            setSelectedPath(selectedDirent.path.startsWith('/') ? selectedDirent.path : `/${selectedDirent.path}`)
            setShow(!show);
            cleanAllNavs();
        }
    }
    
    return (
        <div className={show ? 'file-picker-bg' : 'close-file-picker'}>
            <div className="file-picker">
                <div className="address-bar">
                    <div className="nav-buttons">
                        <button onClick={goBack} className={`nav-button left ${!backNavActive ? 'nav-button-inactive' : ''}`}> <FaArrowLeft/></button>
                        <button onClick={goForward} className={`nav-button ${!forwNavActive ? 'nav-button-inactive' : ''}`}><FaArrowRight/></button>
                    </div>
                    <div className="address-field">
                        {path}
                    </div>
                </div>
                <div className="file-list" onClick={
                    (e) => { 
                        if(e.target.classList.contains('file-list')) 
                            setAllDirentsInActive()
                    }
                }>
                    {
                        dirents.map((val) =>
                            <Dirent 
                                key={uuid()} 
                                direntObj={val}
                                stateSetters={{setDirents : setDirents, setPath : setPath, setHistory : setHistory}}
                                stateVariables={{dirents : dirents, prevPath : path, history : history}}
                                iconsObj={iconsObj}
                            />
                        )
                    }
                </div>
                <div className="action-bar">
                    <button onClick={returnSelectedPath} className="action-button select-button mr-3">Select</button>
                    <button onClick={() => {setShow(!show); cleanAllNavs();}} className="action-button close-button">Close</button>
                </div>
            </div>
        </div> 
    )  
} 


export {FilePicker}