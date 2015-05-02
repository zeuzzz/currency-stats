var socket = io.connect('http://localhost:3000');

var getTrendClass = function (trend) {
    var trendClass = 'glyphicon-minus';
    if (trend == 'asc') {
        trendClass = 'glyphicon-arrow-up text-primary';
    } else if (trend == 'desc') {
        trendClass = 'glyphicon-arrow-down text-warning';
    }
    return trendClass;
};

var MessagesReceived = React.createClass({
    render: function () {
        return (
            <div className={"widget col-md-2 text-center bg-success"}>
                <p className="lead"> Messages received per minute</p>
                <p className="value-number">{this.props.data.messagesPerMinute}</p>
                <span className={'glyphicon ' + getTrendClass(this.props.data.hourTrend)}></span>
            </div>
        );
    }
});

var TopCurrency = React.createClass({
    render: function () {
        var that = this;
        var currencies = this.props.data.map(function (currency) {
            return (<p className="lead" key={currency.value + "pos" + that.props.type}>
                {currency.name}: {(currency.value / 100).toFixed(2)}
                <span className={'glyphicon ' + getTrendClass(currency.trend)}></span>
            </p>);
        });
        return (
            <div className={"widget col-md-2 text-center bg-success"} key={this.props.type}>
                <p className="lead"> {this.props.title}</p>
                {currencies}
            </div>
        );
    }
});

var GridElement = React.createClass({
    getInitialState: function () {
        var that = this;
        socket.on('stats:' + this.props.type, function (stats) {
            that.setState({'stats': stats});
        });
        return {stats: {'data': []}};
    },
    render: function () {
        if (this.props.type == 'messages-received') {
            return <MessagesReceived data={this.state.stats.data} key={this.props.type}></MessagesReceived>
        } else if (this.props.type == 'currency-sell') {
            return <TopCurrency data={this.state.stats.data} type={this.props.type} title="Top 3 sold currencies"></TopCurrency>
        } else if (this.props.type == 'currency-buy') {
            return <TopCurrency data={this.state.stats.data} type={this.props.type} title="Top 3 buy currencies"></TopCurrency>
        }
        return (<p/>);
    }
});

var Map = React.createClass({
    getInitialState: function () {
        var that = this;
        socket.on('stats-list', function (data) {
            that.setState({data: data});
        });
        return {data: []};
    },
    render: function () {
        var gridNodes = [];
        this.state.data.map(function (statType) {
            gridNodes.push(<GridElement type={statType.type} class={statType.class} key={'grid'+statType.type} />);
        });

        return (
            <div className="grid row">
                {gridNodes}
            </div>
        );
    }
});
React.render(<Map/>, document.getElementById('container'));
