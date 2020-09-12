import React, { useEffect, useState } from "react";
import "../stylesheets/matches.css";
import CompanyList from "./CompanyList";
import { useHistory, } from "react-router-dom";
import backendURL from '../backendURL'

export default function MatchesContainer({ setMatchesState, matchesState, jobseekerState, companyState, openingsState  }) {
  let jobseekerId;
  try {
    jobseekerId = JSON.parse(window.localStorage.jobseeker).id;
  } catch (e) {
    // console.log(e)
  }
  let matchesUrl; 
  let history = useHistory();

  let role;
  let id;

  if (companyState !== undefined) {
    try {
      id = companyState.id
      matchesUrl = backendURL + `api/companies/${id}/matches`;
    } catch (e) {

    }
  }
  if (jobseekerState !== undefined) {
    try {
      id = jobseekerState.id
      matchesUrl = backendURL + `api/jobseekers/${id}/matches`;
    } catch (e) {

    }
  }
  jobseekerState !== undefined ? role = 'jobseekers' : role = 'companies'
  // TODO: change to heroku in the future
  const herokuUrl = backendURL + `api/${role}/${id}/chats`
  const [chatsState, setChatsState] = useState([])
  const data = async () => {
    const response = await fetch(herokuUrl); // + '/'
    const { chats } = await response.json();
    setChatsState(chats);
  };

  const fetchMatches = async () => {
    let res;
    try {
      res = await fetch(matchesUrl); // + '/'
    } catch (e) {

    }
    const response = await res.json();
    return response.matches;
  };

  useEffect(() => {
    data();
  }, [])

  useEffect(() => {
    let setMatches = async () => {
      const data = await fetchMatches()
      // console.log(data  )
      setMatchesState(data);
      console.log(matchesState)
    };
    // console.log('triggered')
    setMatches()
  }, []);

  const combineCompanies = (arrOfObjs) => {
    const ans = {};
    arrOfObjs.forEach((value) => {
      if (ans[value.company.company_name] === undefined) {
        ans[value.company.company_name] = {image: value.company.image, openings:[value.opening]};
      } else {
        ans[value.company.company_name].openings.push(value.opening);
      }
    });
    return ans;
  };

  const redirectToChats = () => {
    history.push('/chats')
  }
  let matches;
  if (matchesState.length) {
    matches = combineCompanies(matchesState);
    return (
      <div className="left-container">
        <div className="match-header">
          <h2>Matches</h2>
          <div onClick={redirectToChats}>CHATS</div>
        </div>
        {Object.keys(matches).map((company_name) => (
          <CompanyList company_name={company_name} image={matches[company_name].image} openings={matches[company_name].openings} />
        ))}
      </div>
    );
  } else {
    return <div className="left-container">No matches yet</div>;
  }
}



