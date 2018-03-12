import { Component, ElementRef, NgZone, OnDestroy, OnInit, Inject } from '@angular/core';

import { Http } from '@angular/http';

import { Observable } from "rxjs/Rx";

import {
    D3Service,
    D3,
    Axis,
    BrushBehavior,
    BrushSelection,
    D3BrushEvent,
    ScaleLinear,
    ScaleOrdinal,
    Selection,
    Transition
} from 'd3-ng2-service';


@Component({
    selector: 'counter',
    templateUrl: './counter.component.html'
})
export class CounterComponent implements OnInit {
    private d3: D3;
    public folders: Folder[];
    private originUrl: string;
    private http: Http;
    private treeview: string;

    margin: { left: number, right: number, top: number, bottom: number };
    width: number;
    height: number;
    barHeight: number;
    barWidth: number;
    iteration: number;
    duration: number;
    tree: any;
    root: any;
    svg: any;

    constructor(element: ElementRef, private ngZone: NgZone, d3Service: D3Service,
        http: Http, @Inject('BASE_URL') originUrl: string) {
        this.originUrl = originUrl;
        this.http = http;

        this.d3 = d3Service.getD3();
    }

    getStuff(): Observable<any> {
        return this.http.get(this.originUrl + '/api/FolderTree/FolderTree');
    }

    ngOnInit() {
        this.getStuff().subscribe(result => {
            this.treeview = result.json();
        },
            (err) => console.error(err),
            () => {
                this.doD3Stuff();
            }
        );
    }

    private doD3Stuff() {
        let self = this;
        let d3 = this.d3;

        console.log(this.treeview);
        var treeData = this.treeview;

        // Set the dimensions and margins of the diagram
        this.margin = { top: 20, right: 10, bottom: 30, left: 90 };
        this.width = 960 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.barHeight = 20;
        this.barWidth = this.width * .8;
        this.iteration = 0;
        this.duration = 750;

        // declares a tree layout and assigns the size
        this.tree = d3.tree().size([this.width, this.height]);
        this.tree = d3.tree().nodeSize([0, 30]);


        this.root = this.tree(d3.hierarchy(treeData, function (d: any) { return d.children; }));
        this.root.each((d: any) => {
            d.name = d.id;
            d.id = this.iteration;
            this.iteration++;
        })
        this.root.x0 = this.root.x;
        this.root.y0 = this.root.y;

        this.svg = d3.select(".tree").append("svg")
            .attr("width", this.width + this.margin.right + this.margin.left)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate("
            + this.margin.left + "," + this.margin.top + ")");

        this.update(this.root);
    }

    connector = (node: any) => {
        //curved 
        /*return "M" + node.y + "," + node.x +
            "C" + (node.y + node.parent.y) / 2 + "," + node.x +
            " " + (node.y + node.parent.y) / 2 + "," + node.parent.x +
            " " + node.parent.y + "," + node.parent.x;*/
        //straight
        return "M" + node.parent.y + "," + node.parent.x
            + "V" + node.x + "H" + node.y;
    }

    // Collapse the node and all it's children
    collapse = (node: any) => {
        if (node.children) {
            node._children = node.children
            node._children.forEach(this.collapse)
            node.children = null
        }
    }

    // Toggle children on click.
    click = (node: any) => {
        if (node.children) {
            node._children = node.children;
            node.children = null;
        } else {
            node.children = node._children;
            node._children = null;
        }
        this.update(node);
    }

    update = (source: any) => {

        let nodes = this.tree(this.root)
        let nodesSort: any = [];
        nodes.eachBefore(function (n: any) {
            nodesSort.push(n);
        });
        this.height = Math.max(500, nodesSort.length * this.barHeight + this.margin.top + this.margin.bottom);
        let links = nodesSort.slice(1);
        // Compute the "layout".
        nodesSort.forEach((n: any, i: any) => {
            n.x = i * this.barHeight;
        });

        this.d3.select('svg').transition()
            .duration(this.duration)
            .attr("height", this.height);

        // Update the nodes…
        let node = this.svg.selectAll('g.node')
            .data(nodesSort, function (this: any, d: any) {
                return d.id || (d.id = ++this.i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr('transform', function () {
                return 'translate(' + source.y0 + ',' + source.x0 + ')';
            })
            .on('click', this.click);

        nodeEnter.append('circle')
            .attr('r', 1e-6)
            .style('fill', function (d: any) {
                return d._children ? 'lightsteelblue' : '#fff';
            })
            .style('fill', '#fff')
            .style('stroke', 'steelblue')
            .style('stroke-width', '3');

        nodeEnter.append('text')
            .attr('x', function (d: any) {
                return d.children || d._children ? 10 : 10;
            })
            .attr('dy', '.35em')
            .attr('text-anchor', function (d: any) {
                return d.children || d._children ? 'start' : 'start';
            })
            .text(function (d: any) {
                if (d.data.name.length > 20) {
                    return d.data.name.substring(0, 20) + '...';
                } else {
                    return d.data.name;
                }
            })
            .style('fill-opacity', 1e-6)
            .style('font', '14px sans-serif');

        nodeEnter.append('svg:title').text(function (d: any) {
            return d.data.name;
        });

        // Transition nodes to their new position.
        let nodeUpdate = node.merge(nodeEnter)
            .transition()
            .duration(this.duration);

        nodeUpdate
            .attr('transform', function (d: any) {
                return 'translate(' + d.y + ',' + d.x + ')';
            });

        nodeUpdate.select('circle')
            .attr('r', 4.5)
            .style('fill', function (d: any) {
                return d._children ? 'lightsteelblue' : '#fff';
            });

        nodeUpdate.select('text')
            .style('fill-opacity', 1);

        // Transition exiting nodes to the parent's new position (and remove the nodes)
        var nodeExit = node.exit().transition()
            .duration(this.duration);

        nodeExit
            .attr('transform', function (d: any) {
                return 'translate(' + source.y + ',' + source.x + ')';
            })
            .remove();

        nodeExit.select('circle')
            .attr('r', 1e-6);

        nodeExit.select('text')
            .style('fill-opacity', 1e-6);

        // Update the links…
        var link = this.svg.selectAll('path.link')
            .data(links, function (d: any) {
                // return d.target.id;
                var id = d.id + '->' + d.parent.id;
                return id;
            }
            );

        // Enter any new links at the parent's previous position.
        let linkEnter = link.enter().insert('path', 'g')
            .attr('class', 'link')
            .attr('d', (d: any) => {
                var o = { x: source.x0, y: source.y0, parent: { x: source.x0, y: source.y0 } };
                return this.connector(o);
            })
            .style('fill', 'none')
            .style('stroke', '#ccc')
            .style('stroke-width', '1');

        // Transition links to their new position.
        link.merge(linkEnter).transition()
            .duration(this.duration)
            .attr('d', this.connector);


        // // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(this.duration)
            .attr('d', (d: any) => {
                var o = { x: source.x, y: source.y, parent: { x: source.x, y: source.y } };
                return this.connector(o);
            })
            .remove();

        // Stash the old positions for transition.
        nodesSort.forEach(function (d: any) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
}

interface Folder {
    ID: number;
    name: string;
    parentID: number;
    order: number;
}