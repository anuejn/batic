"use strict";

export default class Raw16 extends React.Component{
    constructor() {
        super();

        this.state = {

        }
    }

    render() {
        return <input  onChange={
            newValue => this.setState({
                value: newValue
            })
        }/>
    }
}