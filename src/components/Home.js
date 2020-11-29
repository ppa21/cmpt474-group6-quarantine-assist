import React from "react"
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container">
            <h1>Welcome to Quarantine Assist!</h1>
            <p>
                Quarantine Assist is a web application connecting individuals who are in quarantine and need assistance with local volunteers. <br />
                People in self-quarantine can create tasks describing what they need help with (ex. grocery shopping, prescription pickup, pet care, etc.)
                and volunteers in their community can help them by picking up the tasks. <br /> <br />
                Create an account to create your first <b><Link to="/task/new">task</Link></b> or volunteer for <b><Link to="/tasks/all">tasks</Link></b>.
            </p>

            <h3>Learn about Self-Isolation &amp; Self-Assessment tools</h3>
            <div className="info-boxes">
                <div className="info-box">
                    <h4>Support &amp; Self-Assessment tools</h4>
                    <div>
                        Help to stop the spread and stay informed by using Support App and Self-Assessment Tool.
                        <a href="https://bc.thrive.health/" target="_blank">BC COVID-19 Help Tools</a>
                    </div>
                </div>
                <div className="info-box">
                    <h4>Self-Isolation</h4>
                    <div>
                        Learn about self-isolation and self-monitoring, what to do if you get sick, and how to prevent the spread of COVID-19.
                        <a href="http://www.bccdc.ca/health-info/diseases-conditions/covid-19/self-isolation" target="_blank">Learn About Self-Isolation</a>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Home;