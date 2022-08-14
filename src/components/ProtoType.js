import React, { Component } from 'react';
import axios from 'axios';

import Typer from './Typer';

class ProtoType extends Component {
    render () {
        return (
            <div className="container">
                <h1>ProtoType</h1>
                <Typer />
            </div>
        );
    };
};

export default ProtoType