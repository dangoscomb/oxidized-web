import React from "react";
import { connect } from "react-redux";
import {Pane, Spinner, Table, Badge, Icon, Popover, Text, Button, TextDropdownButton} from "evergreen-ui";
import JSONPretty from 'react-json-pretty';
import JSONPretty1337 from 'react-json-pretty/dist/1337';
import { filter } from 'fuzzaldrin-plus'

const mapStateToProps = state => {
    return { nodes: state.nodes };
};

const Order = {
    NONE: 'NONE',
    ASC: 'ASC',
    DESC: 'DESC'
}

class NodeTable extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            searchQuery: '',
            orderedColumn: 1,
            ordering: Order.ASC,
            perPage: 25,
            page: 1,
            total: 0
        }

        this.updateSorting = this.updateSorting.bind(this)
    }

    sort = nodes => {
        const { ordering, orderedColumn } = this.state
        // Return if there's no ordering.
        if (ordering === Order.NONE) return nodes

        let propKey = 'name'
        if (orderedColumn === 2) propKey = 'model'
        if (orderedColumn === 3) propKey = 'group'
        if (orderedColumn === 4) propKey = 'status'
        if (orderedColumn === 5) propKey = 'time'
        if (orderedColumn === 6) propKey = 'mtime'

        return nodes.sort((a, b) => {
            let aValue = a[propKey]
            let bValue = b[propKey]

            if(orderedColumn >= 5) {
                console.log(aValue)
                aValue = (isNaN(Date.parse(aValue)) ? 0 : Date.parse(aValue))
                console.log(aValue)
                bValue = isNaN(Date.parse(bValue)) ? 0 : Date.parse(bValue)
            }

            // Support string comparison
            const sortTable = { true: 1, false: -1 }

            // Order ascending (Order.ASC)
            if (this.state.ordering === Order.ASC) {
                return aValue === bValue ? 0 : sortTable[aValue > bValue]
            }

            // Order descending (Order.DESC)
            return bValue === aValue ? 0 : sortTable[bValue > aValue]
        })
    }

    // Filter the profiles based on the name property.
    filter = nodes => {
        const searchQuery = this.state.searchQuery.trim()

        // If the searchQuery is empty, return the profiles as is.
        if (searchQuery.length === 0) return nodes

        return nodes.filter(node => {
            // Use the filter from fuzzaldrin-plus to filter by name.
            const result = filter([node.name], searchQuery)
            return result.length === 1
        })
    }

    updateSorting(col) {
        if(col === this.state.orderedColumn) {
            if(this.state.ordering === Order.ASC) {
                this.setState({ordering: Order.DESC});
            }
            else {
                this.setState({ordering: Order.ASC});
            }
        }
        else {
            this.setState({ordering: Order.DESC, 'orderedColumn': col});
        }
        console.log(this.state)
    }

    drawHeaderCell(col, title) {
        return(
            <Table.TextHeaderCell>
                {this.state.orderedColumn === col ?
                <TextDropdownButton
                    icon={
                        this.state.ordering === Order.ASC
                            ? 'caret-up'
                            : 'caret-down'
                    }
                    onClick={() => this.updateSorting(col)}
                >
                    {title}
                </TextDropdownButton>
                    :
                    <TextDropdownButton icon={false} onClick={() => this.updateSorting(col)}>
                        {title}
                    </TextDropdownButton>
                }
            </Table.TextHeaderCell>
        )
    }

    renderPagination() {
        return(
            <Pane alignItems="center"
                  justifyContent="center" display="flex">
                <Button disabled={this.state.page === 1 ? true : false} marginRight={16} iconBefore="arrow-left" height={20} onClick={() => {
                    this.setState({page: this.state.page-1})
                }}>
                    Prev
                </Button>
                <Text marginRight={16}>
                        {this.state.page} of {Math.ceil(this.filter(this.props.nodes).length/this.state.perPage)}
                </Text>
                <Button disabled={this.state.page === Math.ceil(this.filter(this.props.nodes).length/this.state.perPage) ? true : false} iconAfter="arrow-right"  height={20} onClick={() => {
                this.setState({page: this.state.page+1})
                }}>
                    Next
                </Button>
            </Pane>
        )
    }

    render() {
        if (this.props.nodes.length <= 0) {
            return(
                <Pane>
                    <Spinner marginX="auto" marginY={120} />
                </Pane>
            )
        }
        const items = this.filter(this.sort(this.props.nodes))
        return(
            <Pane background="tint2">
                {this.renderPagination()}
            <Table>
                <Table.Head>
                    <Table.SearchHeaderCell spellCheck={false} onKeyUp={(e) => { if (e.key === 'Enter') { this.setState({searchQuery: e.target.value}) }}}>test</Table.SearchHeaderCell>
                    {this.drawHeaderCell(2, "Model")}
                    {this.drawHeaderCell(3, "Group")}
                    {this.drawHeaderCell(4, "Last Status")}
                    {this.drawHeaderCell(5, "Last Update")}
                    {this.drawHeaderCell(6, "Last Changed")}
                    <Table.TextHeaderCell>Actions</Table.TextHeaderCell>
                </Table.Head>
                <Table.Body>
                    {items.slice(((this.state.page * this.state.perPage) - this.state.perPage),(this.state.page * this.state.perPage)).map(node => (
                        <Table.Row key={node.full_name}>
                            <Table.TextCell>
                                <Popover
                                    content={
                                        <Pane
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            flexDirection="column"
                                        >
                                            <JSONPretty id="json-pretty" data={node} theme={JSONPretty1337} style={{backgroundColor: '#1e1e1e', padding: '16px'}}></JSONPretty>
                                        </Pane>
                                    }
                                >
                                    <Text><Button appearance="minimal">{node.name}</Button></Text>
                                </Popover>
                            </Table.TextCell>
                            <Table.TextCell>{node.model}</Table.TextCell>
                            <Table.TextCell>{node.group}</Table.TextCell>
                            <Table.TextCell>
                                {node.status === 'never' && <Badge color="blue" isSolid>Never</Badge>}
                                {node.status === 'no_connection' && <Badge color="red" isSolid>Failed</Badge>}
                                {node.status === 'success' && <Badge color="green" isSolid>Success</Badge>}
                            </Table.TextCell>
                            <Table.TextCell>{node.time}</Table.TextCell>
                            <Table.TextCell>{node.mtime}</Table.TextCell>
                            <Table.TextCell>
                                <Icon icon="cloud-download" size={14} marginRight={10}/>{' '}
                                <Icon icon="layers" size={14} marginRight={10}/>{' '}
                                <Icon icon="refresh" size={14}/>
                            </Table.TextCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
                {this.renderPagination()}
            </Pane>
        )
    }
}

export default connect(mapStateToProps)(NodeTable)
