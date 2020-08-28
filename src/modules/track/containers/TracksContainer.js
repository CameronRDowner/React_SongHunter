import React, { Component } from 'react';
import {Consumer} from '../../../context';
import {TracksSkeletonScreen} from '../components/TracksSkeletonScreen.js';
import {Track} from '../components/Track.js';
import {Search} from '../components/Search';
import axios from 'axios';
import {Context} from '../../../context';

export const TracksContainer = () => {
    const baseUrl = "https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?";
    const pageConfigURL = "&page_size=10$page=1&s_track_rating=desc"
    const apiKeyUrl = `&apikey=${process.env.REACT_APP_MM_KEY}`;
    const {dispatch} = useContext(Context)
    const handleSearchByTrackName = (_trackName) => {
        getTrackByName(_trackName)
        .then(result=>{
            setTrackList(result.data.message.body.track_list);
        })
        .catch(_error=>{
            console.log(_error);
        })
    }
    const handleSearchByTrackLyrics = (_trackLyrics) => {
        getTrackByLyrics(_trackLyrics)
        .then(result=>{
            setTrackList(result.data.message.body.track_list)
        })
        .catch(_error=>{
            console.log(_error)
        })
    }
    const getTrackByName = (trackName) =>{
        return axios.get(`${baseUrl}q_track=${trackName}${pageConfigURL}${apiKeyUrl}`)
    }
    const getTrackByLyrics = (trackLyrics) =>{
        return axios.get(`${baseUrl}q_lyrics=${trackLyrics}${pageConfigURL}${apiKeyUrl}`)
    }
    const setTrackList = (_trackList) =>{
        dispatch({
            type: 'SET_TRACK_LIST',
            payload: _trackList
        });
    }
    return (
        <main>
            <Search SearchByTrackLyrics={handleSearchByTrackLyrics} SearchByTrackName={handleSearchByTrackName}/>
        <Consumer>
                {value => {
                 const {trackList} = value;

                 if(trackList === undefined || trackList === 0){
                    return <TracksSkeletonScreen/>;
                 }
                 else{
                    return (
                    <div id="tracks-container" className="flex-container-row-start">
                        {trackList.map(item => (
                            <Track key={item.track.track_id} track={item.track} />
                        ))}
                    </div>
                    )
                 }
                }}
        </Consumer>
        </main>
    )
}

