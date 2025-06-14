/*
http://bryntum.com - http://bryntum.com/examples/gantt-latest/gnt-all-debug.js
*/

Ext.define("Sch.util.Patch", {
    target: null,
    minVersion: null,
    maxVersion: null,
    reportUrl: null,
    description: null,
    applyFn: null,
    ieOnly: false,
    onClassExtended: function (a, b) {
        if (Sch.disableOverrides) {
            return
        }
        if (b.ieOnly && !Ext.isIE) {
            return
        }
        if (b.applyFn) {
            b.applyFn()
        } else {
            if ((!b.minVersion || Ext.versions.extjs.equals(b.minVersion) || Ext.versions.extjs.isGreaterThan(b.minVersion)) && (!b.maxVersion || Ext.versions.extjs.equals(b.maxVersion) || Ext.versions.extjs.isLessThan(b.maxVersion))) {
                b.requires[0].override(b.overrides)
            }
        }
    }
});
Ext.define("Sch.patches.LoadMask", {
    extend: "Sch.util.Patch",
    requires: ["Ext.view.AbstractView"],
    minVersion: "4.1.0b3",
    reportURL: "http://www.sencha.com/forum/showthread.php?187700-4.1.0-B3-Ext.AbstractView-no-longer-binds-its-store-to-load-mask",
    description: "In Ext4.1 loadmask no longer bind the store",
    overrides: {}
});
Ext.define("Sch.patches.Table", {
    extend: "Sch.util.Patch",
    requires: ["Ext.view.Table"],
    minVersion: "4.1.1",
    maxVersion: "4.1.1",
    reportURL: "http://www.sencha.com/forum/showthread.php?238026-4.1.1-Alt-row-styling-lost-after-record-update&p=874190#post874190",
    description: "In Ext4.1.1 when record is updated, the alternate row styling is lost",
    overrides: {
        onUpdate: function (c, a, b, e) {
            var d = this.store.indexOf(a);
            this.callParent(arguments);
            this.doStripeRows(d, d)
        }
    }
});
Ext.define("Sch.patches.TreeView", {
    extend: "Sch.util.Patch",
    requires: ["Ext.tree.View"],
    applyFn: function () {
        Ext.tree.View.addMembers({
            providedStore: null,
            initComponent: function () {
                var a = this,
                    b = a.panel.getStore();
                if (a.initialConfig.animate === undefined) {
                    a.animate = Ext.enableFx
                }
                a.store = a.providedStore || new Ext.data.NodeStore({
                    treeStore: b,
                    recursive: true,
                    rootVisible: a.rootVisible
                });
                a.store.on({
                    beforeexpand: a.onBeforeExpand,
                    expand: a.onExpand,
                    beforecollapse: a.onBeforeCollapse,
                    collapse: a.onCollapse,
                    write: a.onStoreWrite,
                    datachanged: a.onStoreDataChanged,
                    scope: a
                });
                if (a.node && !a.store.node) {
                    a.setRootNode(a.node)
                }
                a.animQueue = {};
                a.animWraps = {};
                a.addEvents("afteritemexpand", "afteritemcollapse");
                a.callParent(arguments);
                a.on({
                    element: "el",
                    scope: a,
                    delegate: a.expanderSelector,
                    mouseover: a.onExpanderMouseOver,
                    mouseout: a.onExpanderMouseOut
                });
                a.on({
                    element: "el",
                    scope: a,
                    delegate: a.checkboxSelector,
                    click: a.onCheckboxChange
                })
            }
        })
    }
});
Ext.define("Sch.patches.DataOperation", {
    extend: "Sch.util.Patch",
    requires: ["Ext.data.Operation"],
    reportURL: "http://www.sencha.com/forum/showthread.php?198894-4.1-Ext.data.TreeStore-CRUD-regression.",
    description: "In Ext 4.1.0 newly created records do not get the Id returned by server applied",
    maxVersion: "4.1.0",
    overrides: {
        commitRecords: function (j) {
            var g = this,
                h, f, a, c, b, d, e;
            if (!g.actionSkipSyncRe.test(g.action)) {
                a = g.records;
                if (a && a.length) {
                    if (a.length > 1) {
                        if (g.action == "update" || a[0].clientIdProperty) {
                            h = new Ext.util.MixedCollection();
                            h.addAll(j);
                            for (f = a.length; f--;) {
                                b = a[f];
                                c = h.findBy(g.matchClientRec, b);
                                b.copyFrom(c)
                            }
                        } else {
                            for (d = 0, e = a.length; d < e; ++d) {
                                b = a[d];
                                c = j[d];
                                if (b && c) {
                                    g.updateRecord(b, c)
                                }
                            }
                        }
                    } else {
                        this.updateRecord(a[0], j[0])
                    }
                    if (g.actionCommitRecordsRe.test(g.action)) {
                        for (f = a.length; f--;) {
                            a[f].commit()
                        }
                    }
                }
            }
        },
        updateRecord: function (a, b) {
            if (b && (a.phantom || a.getId() === b.getId())) {
                a.copyFrom(b)
            }
        }
    }
});
Ext.define("Sch.patches.TreeStore", {
    extend: "Sch.util.Patch",
    requires: ["Ext.data.TreeStore"],
    description: "http://www.sencha.com/forum/showthread.php?208602-Model-s-Id-field-not-defined-after-sync-in-TreeStore-%28CRUD%29",
    maxVersion: "4.1.0",
    overrides: {
        onCreateRecords: function (c) {
            this.callParent(arguments);
            var d = 0,
                b = c.length,
                a = this.tree,
                e;
            for (; d < b; ++d) {
                e = c[d];
                a.onNodeIdChanged(e, null, e.getId())
            }
        },
        setRootNode: function (a, e) {
            var d = this,
                c = d.model,
                b = c.prototype.idProperty;
            a = a || {};
            if (!a.isModel) {
                Ext.applyIf(a, {
                    text: "Root",
                    allowDrag: false
                });
                if (a[b] === undefined) {
                    a[b] = d.defaultRootId
                }
                Ext.data.NodeInterface.decorate(c);
                a = Ext.ModelManager.create(a, c)
            } else {
                if (a.isModel && !a.isNode) {
                    Ext.data.NodeInterface.decorate(c)
                }
            }
            d.getProxy().getReader().buildExtractors(true);
            d.tree.setRootNode(a);
            if (e !== true && !a.isLoaded() && (d.autoLoad === true || a.isExpanded())) {
                d.load({
                    node: a
                })
            }
            return a
        }
    }
});
Ext.define("Sch.util.Date", {
    requires: "Ext.Date",
    singleton: true,
    unitsByName: {},
    constructor: function () {
        var b = Ext.Date;
        var d = {
            MILLI: b.MILLI,
            SECOND: b.SECOND,
            MINUTE: b.MINUTE,
            HOUR: b.HOUR,
            DAY: b.DAY,
            WEEK: "w",
            MONTH: b.MONTH,
            QUARTER: "q",
            YEAR: b.YEAR
        };
        Ext.apply(this, d);
        var c = this;
        this.units = [c.MILLI, c.SECOND, c.MINUTE, c.HOUR, c.DAY, c.WEEK, c.MONTH, c.QUARTER, c.YEAR];
        for (var a in d) {
            if (d.hasOwnProperty(a)) {
                var e = d[a];
                c.unitNames[e] = c.unitNames[a];
                c.unitsByName[a] = e;
                c.unitsByName[e] = e
            }
        }
    },
    betweenLesser: function (b, d, a) {
        var c = b.getTime();
        return d.getTime() <= c && c < a.getTime()
    },
    constrain: function (b, c, a) {
        return this.min(this.max(b, c), a)
    },
    compareUnits: function (c, b) {
        var a = Ext.Array.indexOf(this.units, c),
            d = Ext.Array.indexOf(this.units, b);
        return a > d ? 1 : (a < d ? -1 : 0)
    },
    isUnitGreater: function (b, a) {
        return this.compareUnits(b, a) > 0
    },
    copyTimeValues: function (b, a) {
        b.setHours(a.getHours());
        b.setMinutes(a.getMinutes());
        b.setSeconds(a.getSeconds());
        b.setMilliseconds(a.getMilliseconds())
    },
    add: function (b, c, e) {
        var f = Ext.Date.clone(b);
        if (!c || e === 0) {
            return f
        }
        switch (c.toLowerCase()) {
        case this.MILLI:
            f = new Date(b.getTime() + e);
            break;
        case this.SECOND:
            f = new Date(b.getTime() + (e * 1000));
            break;
        case this.MINUTE:
            f = new Date(b.getTime() + (e * 60000));
            break;
        case this.HOUR:
            f = new Date(b.getTime() + (e * 3600000));
            break;
        case this.DAY:
            f.setDate(b.getDate() + e);
            break;
        case this.WEEK:
            f.setDate(b.getDate() + e * 7);
            break;
        case this.MONTH:
            var a = b.getDate();
            if (a > 28) {
                a = Math.min(a, Ext.Date.getLastDateOfMonth(this.add(Ext.Date.getFirstDateOfMonth(b), this.MONTH, e)).getDate())
            }
            f.setDate(a);
            f.setMonth(f.getMonth() + e);
            break;
        case this.QUARTER:
            f = this.add(b, this.MONTH, e * 3);
            break;
        case this.YEAR:
            f.setFullYear(b.getFullYear() + e);
            break
        }
        return f
    },
    getMeasuringUnit: function (a) {
        if (a === this.WEEK) {
            return this.DAY
        }
        return a
    },
    getDurationInUnit: function (d, a, c) {
        var b;
        switch (c) {
        case this.YEAR:
            b = Math.round(this.getDurationInYears(d, a));
            break;
        case this.QUARTER:
            b = Math.round(this.getDurationInMonths(d, a) / 3);
            break;
        case this.MONTH:
            b = Math.round(this.getDurationInMonths(d, a));
            break;
        case this.WEEK:
            b = Math.round(this.getDurationInDays(d, a)) / 7;
            break;
        case this.DAY:
            b = Math.round(this.getDurationInDays(d, a));
            break;
        case this.HOUR:
            b = Math.round(this.getDurationInHours(d, a));
            break;
        case this.MINUTE:
            b = Math.round(this.getDurationInMinutes(d, a));
            break;
        case this.SECOND:
            b = Math.round(this.getDurationInSeconds(d, a));
            break;
        case this.MILLI:
            b = Math.round(this.getDurationInMilliseconds(d, a));
            break
        }
        return b
    },
    getUnitToBaseUnitRatio: function (b, a) {
        if (b === a) {
            return 1
        }
        switch (b) {
        case this.YEAR:
            switch (a) {
            case this.QUARTER:
                return 1 / 4;
            case this.MONTH:
                return 1 / 12
            }
            break;
        case this.QUARTER:
            switch (a) {
            case this.YEAR:
                return 4;
            case this.MONTH:
                return 1 / 3
            }
            break;
        case this.MONTH:
            switch (a) {
            case this.YEAR:
                return 12;
            case this.QUARTER:
                return 3
            }
            break;
        case this.WEEK:
            switch (a) {
            case this.DAY:
                return 1 / 7;
            case this.HOUR:
                return 1 / 168
            }
            break;
        case this.DAY:
            switch (a) {
            case this.WEEK:
                return 7;
            case this.HOUR:
                return 1 / 24;
            case this.MINUTE:
                return 1 / 1440
            }
            break;
        case this.HOUR:
            switch (a) {
            case this.DAY:
                return 24;
            case this.MINUTE:
                return 1 / 60
            }
            break;
        case this.MINUTE:
            switch (a) {
            case this.HOUR:
                return 60;
            case this.SECOND:
                return 1 / 60;
            case this.MILLI:
                return 1 / 60000
            }
            break;
        case this.SECOND:
            switch (a) {
            case this.MILLI:
                return 1 / 1000
            }
            break;
        case this.MILLI:
            switch (a) {
            case this.SECOND:
                return 1000
            }
            break
        }
        return -1
    },
    getDurationInMilliseconds: function (b, a) {
        return (a - b)
    },
    getDurationInSeconds: function (b, a) {
        return (a - b) / 1000
    },
    getDurationInMinutes: function (b, a) {
        return (a - b) / 60000
    },
    getDurationInHours: function (b, a) {
        return (a - b) / 3600000
    },
    getDurationInDays: function (b, a) {
        return (a - b) / 86400000
    },
    getDurationInBusinessDays: function (g, b) {
        var c = Math.round((b - g) / 86400000),
            a = 0,
            f;
        for (var e = 0; e < c; e++) {
            f = this.add(g, this.DAY, e).getDay();
            if (f !== 6 && f !== 0) {
                a++
            }
        }
        return a
    },
    getDurationInMonths: function (b, a) {
        return ((a.getFullYear() - b.getFullYear()) * 12) + (a.getMonth() - b.getMonth())
    },
    getDurationInYears: function (b, a) {
        return this.getDurationInMonths(b, a) / 12
    },
    min: function (b, a) {
        return b < a ? b : a
    },
    max: function (b, a) {
        return b > a ? b : a
    },
    intersectSpans: function (c, d, b, a) {
        return this.betweenLesser(c, b, a) || this.betweenLesser(b, c, d)
    },
    getNameOfUnit: function (a) {
        a = this.getUnitByName(a);
        switch (a.toLowerCase()) {
        case this.YEAR:
            return "YEAR";
        case this.QUARTER:
            return "QUARTER";
        case this.MONTH:
            return "MONTH";
        case this.WEEK:
            return "WEEK";
        case this.DAY:
            return "DAY";
        case this.HOUR:
            return "HOUR";
        case this.MINUTE:
            return "MINUTE";
        case this.SECOND:
            return "SECOND";
        case this.MILLI:
            return "MILLI"
        }
        throw "Incorrect UnitName"
    },
    unitNames: {
        YEAR: {
            single: "year",
            plural: "years",
            abbrev: "yr"
        },
        QUARTER: {
            single: "quarter",
            plural: "quarters",
            abbrev: "q"
        },
        MONTH: {
            single: "month",
            plural: "months",
            abbrev: "mon"
        },
        WEEK: {
            single: "week",
            plural: "weeks",
            abbrev: "w"
        },
        DAY: {
            single: "day",
            plural: "days",
            abbrev: "d"
        },
        HOUR: {
            single: "hour",
            plural: "hours",
            abbrev: "h"
        },
        MINUTE: {
            single: "minute",
            plural: "minutes",
            abbrev: "min"
        },
        SECOND: {
            single: "second",
            plural: "seconds",
            abbrev: "s"
        },
        MILLI: {
            single: "ms",
            plural: "ms",
            abbrev: "ms"
        }
    },
    getReadableNameOfUnit: function (b, a) {
        return this.unitNames[b][a ? "plural" : "single"]
    },
    getShortNameOfUnit: function (a) {
        return this.unitNames[a].abbrev
    },
    getUnitByName: function (a) {
        if (!this.unitsByName[a]) {
            Ext.Error.raise("Unknown unit name: " + a)
        }
        return this.unitsByName[a]
    },
    getNext: function (c, f, a, e) {
        var d = Ext.Date.clone(c);
        a = a || 1;
        switch (f) {
        case this.DAY:
            Ext.Date.clearTime(d);
            d = this.add(d, this.DAY, a);
            break;
        case this.WEEK:
            var b = d.getDay();
            d = this.add(d, this.DAY, (7 * (a - 1)) + (b < e ? (e - b) : (7 - b + e)));
            break;
        case this.MONTH:
            d = this.add(d, this.MONTH, a);
            d.setDate(1);
            break;
        case this.QUARTER:
            d = this.add(d, this.MONTH, ((a - 1) * 3) + (3 - (d.getMonth() % 3)));
            break;
        case this.YEAR:
            d = new Date(d.getFullYear() + a, 0, 1);
            break;
        default:
            d = this.add(c, f, a);
            break
        }
        return d
    },
    getNumberOfMsFromTheStartOfDay: function (a) {
        return a - Ext.Date.clearTime(a, true) || 86400000
    },
    getNumberOfMsTillTheEndOfDay: function (a) {
        return this.getStartOfNextDay(a, true) - a
    },
    getStartOfNextDay: function (b, e) {
        var d = this.add(Ext.Date.clearTime(b, e), this.DAY, 1);
        if (d.getDate() == b.getDate()) {
            var c = this.add(Ext.Date.clearTime(b, e), this.DAY, 2).getTimezoneOffset();
            var a = b.getTimezoneOffset();
            d = this.add(d, this.MINUTE, a - c)
        }
        return d
    },
    getEndOfPreviousDay: function (b) {
        var a = Ext.Date.clearTime(b, true);
        if (a - b) {
            return a
        } else {
            return this.add(a, this.DAY, - 1)
        }
    },
    timeSpanContains: function (c, b, d, a) {
        return (d - c) >= 0 && (b - a) >= 0
    }
});
Ext.define("Sch.util.DragTracker", {
    extend: "Ext.dd.DragTracker",
    xStep: 1,
    yStep: 1,
    setXStep: function (a) {
        this.xStep = a
    },
    setYStep: function (a) {
        this.yStep = a
    },
    getRegion: function () {
        var e = this.startXY,
            d = this.getXY(),
            b = Math.min(e[0], d[0]),
            f = Math.min(e[1], d[1]),
            c = Math.abs(e[0] - d[0]),
            a = Math.abs(e[1] - d[1]);
        return new Ext.util.Region(f, b + c, f + a, b)
    },
    onMouseDown: function (f, d) {
        if (this.disabled || f.dragTracked) {
            return
        }
        var c = f.getXY(),
            g, b, a = c[0],
            h = c[1];
        if (this.xStep > 1) {
            g = this.el.getX();
            a -= g;
            a = Math.round(a / this.xStep) * this.xStep;
            a += g
        }
        if (this.yStep > 1) {
            b = this.el.getY();
            h -= b;
            h = Math.round(h / this.yStep) * this.yStep;
            h += b
        }
        this.dragTarget = this.delegate ? d : this.handle.dom;
        this.startXY = this.lastXY = [a, h];
        this.startRegion = Ext.fly(this.dragTarget).getRegion();
        if (this.fireEvent("mousedown", this, f) === false || this.fireEvent("beforedragstart", this, f) === false || this.onBeforeStart(f) === false) {
            return
        }
        this.mouseIsDown = true;
        f.dragTracked = true;
        if (this.preventDefault !== false) {
            f.preventDefault()
        }
        Ext.getDoc().on({
            scope: this,
            mouseup: this.onMouseUp,
            mousemove: this.onMouseMove,
            selectstart: this.stopSelect
        });
        if (this.autoStart) {
            this.timer = Ext.defer(this.triggerStart, this.autoStart === true ? 1000 : this.autoStart, this, [f])
        }
    },
    onMouseMove: function (g, f) {
        if (this.active && Ext.isIE && !g.browserEvent.button) {
            g.preventDefault();
            this.onMouseUp(g);
            return
        }
        g.preventDefault();
        var d = g.getXY(),
            b = this.startXY;
        if (!this.active) {
            if (Math.max(Math.abs(b[0] - d[0]), Math.abs(b[1] - d[1])) > this.tolerance) {
                this.triggerStart(g)
            } else {
                return
            }
        }
        var a = d[0],
            h = d[1];
        if (this.xStep > 1) {
            a -= this.startXY[0];
            a = Math.round(a / this.xStep) * this.xStep;
            a += this.startXY[0]
        }
        if (this.yStep > 1) {
            h -= this.startXY[1];
            h = Math.round(h / this.yStep) * this.yStep;
            h += this.startXY[1]
        }
        var c = this.xStep > 1 || this.yStep > 1;
        if (!c || a !== d[0] || h !== d[1]) {
            this.lastXY = [a, h];
            if (this.fireEvent("mousemove", this, g) === false) {
                this.onMouseUp(g)
            } else {
                this.onDrag(g);
                this.fireEvent("drag", this, g)
            }
        }
    }
});
Ext.define("Sch.util.HeaderRenderers", {
    singleton: true,
    requires: ["Sch.util.Date", "Ext.XTemplate"],
    constructor: function () {
        var b = Ext.create("Ext.XTemplate", '<table class="sch-nested-hdr-tbl ' + Ext.baseCSSPrefix + 'column-header-text" cellpadding="0" cellspacing="0"><tr><tpl for="."><td style="width:{[100/xcount]}%" class="{cls} sch-dayheadercell-{dayOfWeek}">{text}</td></tpl></tr></table>').compile();
        var a = Ext.create("Ext.XTemplate", '<table class="sch-nested-hdr-tbl" cellpadding="0" cellspacing="0"><tr><tpl for="."><td style="width:{[100/xcount]}%" class="{cls}">{text}</td></tpl></tr></table>').compile();
        return {
            quarterMinute: function (f, d, c, e) {
                c.headerCls = "sch-nested-hdr-pad";
                return '<table class="sch-nested-hdr-tbl" cellpadding="0" cellspacing="0"><tr><td>00</td><td>15</td><td>30</td><td>45</td></tr></table>'
            },
            dateCells: function (d, c, e) {
                return function (j, g, f) {
                    f.headerCls = "sch-nested-hdr-nopad";
                    var i = [],
                        h = Ext.Date.clone(j);
                    while (h < g) {
                        i.push({
                            text: Ext.Date.format(h, e)
                        });
                        h = Sch.util.Date.add(h, d, c)
                    }
                    i[0].cls = "sch-nested-hdr-cell-first";
                    i[i.length - 1].cls = "sch-nested-hdr-cell-last";
                    return a.apply(i)
                }
            },
            dateNumber: function (g, d, c) {
                c.headerCls = "sch-nested-hdr-nopad";
                var f = [],
                    e = Ext.Date.clone(g);
                while (e < d) {
                    f.push({
                        dayOfWeek: e.getDay(),
                        text: e.getDate()
                    });
                    e = Sch.util.Date.add(e, Sch.util.Date.DAY, 1)
                }
                return b.apply(f)
            },
            dayLetter: function (g, d, c) {
                c.headerCls = "sch-nested-hdr-nopad";
                var f = [],
                    e = g;
                while (e < d) {
                    f.push({
                        dayOfWeek: e.getDay(),
                        text: Ext.Date.dayNames[e.getDay()].substr(0, 1)
                    });
                    e = Sch.util.Date.add(e, Sch.util.Date.DAY, 1)
                }
                f[0].cls = "sch-nested-hdr-cell-first";
                f[f.length - 1].cls = "sch-nested-hdr-cell-last";
                return b.apply(f)
            },
            dayStartEndHours: function (e, d, c) {
                c.headerCls = "sch-hdr-startend";
                return Ext.String.format('<span class="sch-hdr-start">{0}</span><span class="sch-hdr-end">{1}</span>', Ext.Date.format(e, "G"), Ext.Date.format(d, "G"))
            }
        }
    }
});
Ext.define("Sch.model.Customizable", {
    extend: "Ext.data.Model",
    customizableFields: null,
    onClassExtended: function (b, d, a) {
        var c = a.onBeforeCreated;
        a.onBeforeCreated = function (f, k) {
            c.call(this, f, k);
            var j = f.prototype;
            if (!j.customizableFields) {
                return
            }
            j.customizableFields = (f.superclass.customizableFields || []).concat(j.customizableFields);
            var g = j.customizableFields;
            var i = {};
            Ext.Array.each(g, function (l) {
                if (typeof l == "string") {
                    l = {
                        name: l
                    }
                }
                i[l.name] = l
            });
            var e = j.fields;
            var h = [];
            e.each(function (l) {
                if (l.isCustomizableField) {
                    h.push(l)
                }
            });
            e.removeAll(h);
            Ext.Object.each(i, function (l, o) {
                o.isCustomizableField = true;
                var p = o.name;
                var t = p === "Id" ? "idProperty" : p.charAt(0).toLowerCase() + p.substr(1) + "Field";
                var q = j[t];
                var s = q || p;
                if (e.containsKey(s)) {
                    e.getByKey(s).isCustomizableField = true;
                    g.push(new Ext.data.Field(Ext.applyIf({
                        name: p,
                        isCustomizableField: true
                    }, e.getByKey(s))))
                } else {
                    e.add(new Ext.data.Field(Ext.applyIf({
                        name: s,
                        isCustomizableField: true
                    }, o)))
                }
                var n = Ext.String.capitalize(p);
                if (n != "Id") {
                    var r = "get" + n;
                    var m = "set" + n;
                    if (!j[r] || j[r].__getterFor__ && j[r].__getterFor__ != s) {
                        j[r] = function () {
                            return this.data[s]
                        };
                        j[r].__getterFor__ = s
                    }
                    if (!j[m] || j[m].__setterFor__ && j[m].__setterFor__ != s) {
                        j[m] = function (u) {
                            return this.set(s, u)
                        };
                        j[m].__setterFor__ = s
                    }
                }
            })
        }
    },
    set: function (c, b) {
        if (arguments.length === 2) {
            this.previous = this.previous || {};
            var a = this.get(c);
            if (a !== b) {
                this.previous[c] = a
            }
        }
        this.callParent(arguments)
    },
    afterEdit: function () {
        this.callParent(arguments);
        delete this.previous
    },
    reject: function () {
        var b = this,
            a = b.modified,
            c;
        b.previous = b.previous || {};
        for (c in a) {
            if (a.hasOwnProperty(c)) {
                if (typeof a[c] != "function") {
                    b.previous[c] = b.get(c)
                }
            }
        }
        b.callParent(arguments);
        delete b.previous
    }
});
Ext.define("Sch.patches.Model", {
    extend: "Sch.util.Patch",
    requires: "Sch.model.Customizable",
    reportURL: "http://www.sencha.com/forum/showthread.php?198250-4.1-Ext.data.Model-regression",
    description: "In Ext 4.1 Models cannot be subclassed",
    maxVersion: "4.1.0",
    applyFn: function () {
        try {
            Ext.define("Sch.foo", {
                extend: "Ext.data.Model",
                fields: ["a"]
            });
            Ext.define("Sch.foo.Sub", {
                extend: "Sch.foo",
                fields: ["a"]
            })
        } catch (a) {
            Ext.data.Types.AUTO.convert = function (b) {
                return b
            }
        }
    }
});
Ext.define("Sch.model.Range", {
    extend: "Sch.model.Customizable",
    requires: ["Sch.util.Date", "Sch.patches.DataOperation"],
    startDateField: "StartDate",
    endDateField: "EndDate",
    nameField: "Name",
    clsField: "Cls",
    customizableFields: [{
        name: "StartDate",
        type: "date",
        dateFormat: "c"
    }, {
        name: "EndDate",
        type: "date",
        dateFormat: "c"
    }, {
        name: "Cls",
        type: "string"
    }, {
        name: "Name",
        type: "string"
    }],
    setStartEndDate: function (b, a) {
        this.beginEdit();
        this.set(this.startDateField, b);
        this.set(this.endDateField, a);
        this.endEdit()
    },
    getDates: function () {
        var c = [],
            b = this.getEndDate();
        for (var a = Ext.Date.clearTime(this.getStartDate(), true); a < b; a = Sch.util.Date.add(a, Sch.util.Date.DAY, 1)) {
            c.push(a)
        }
        return c
    },
    forEachDate: function (b, a) {
        return Ext.each(this.getDates(), b, a)
    },
    isValid: function () {
        var b = this.callParent(arguments);
        if (b) {
            var c = this.getStartDate(),
                a = this.getEndDate();
            b = !c || !a || (a - c >= 0)
        }
        return b
    },
    shift: function (b, a) {
        this.setStartEndDate(Sch.util.Date.add(this.getStartDate(), b, a), Sch.util.Date.add(this.getEndDate(), b, a))
    }
});
Ext.define("Sch.model.Resource", {
    extend: "Sch.model.Customizable",
    idProperty: "Id",
    nameField: "Name",
    customizableFields: ["Id", {
        name: "Name",
        type: "string"
    }],
    getEventStore: function () {
        return this.stores[0] && this.stores[0].eventStore || this.parentNode && this.parentNode.getEventStore()
    },
    getEvents: function (d) {
        var c = [],
            e, f = this.getId() || this.internalId;
        d = d || this.getEventStore();
        for (var b = 0, a = d.getCount(); b < a; b++) {
            e = d.getAt(b);
            if (e.data[e.resourceIdField] === f) {
                c.push(e)
            }
        }
        return c
    }
});
Ext.define("Sch.data.mixin.ResourceStore", {});
Ext.define("Sch.data.ResourceStore", {
    extend: "Ext.data.Store",
    model: "Sch.model.Resource",
    mixins: ["Sch.data.mixin.ResourceStore"]
});
Ext.define("Sch.data.TimeAxis", {
    extend: "Ext.util.Observable",
    requires: ["Ext.data.JsonStore", "Sch.util.Date"],
    continuous: true,
    autoAdjust: true,
    constructor: function (a) {
        Ext.apply(this, a);
        this.originalContinuous = this.continuous;
        this.addEvents("beforereconfigure", "reconfigure");
        this.tickStore = new Ext.data.JsonStore({
            fields: ["start", "end"]
        });
        this.tickStore.on("datachanged", function () {
            this.fireEvent("reconfigure", this)
        }, this);
        this.callParent(arguments)
    },
    reconfigure: function (a) {
        Ext.apply(this, a);
        var c = this.tickStore,
            b = this.generateTicks(this.start, this.end, this.unit, this.increment || 1, this.mainUnit);
        if (this.fireEvent("beforereconfigure", this, this.start, this.end) !== false) {
            c.suspendEvents(true);
            c.loadData(b);
            if (c.getCount() === 0) {
                Ext.Error.raise("Invalid time axis configuration or filter, please check your input data.")
            }
            c.resumeEvents()
        }
    },
    setTimeSpan: function (b, a) {
        this.reconfigure({
            start: b,
            end: a
        })
    },
    filterBy: function (b, a) {
        this.continuous = false;
        a = a || this;
        var c = this.tickStore;
        c.clearFilter(true);
        c.suspendEvents(true);
        c.filter([{
            filterFn: function (e, d) {
                return b.call(a, e.data, d)
            }
        }]);
        if (c.getCount() === 0) {
            Ext.Error.raise("Invalid time axis filter - no columns passed through the filter. Please check your filter method.");
            this.clearFilter()
        }
        c.resumeEvents()
    },
    isContinuous: function () {
        return this.continuous && !this.tickStore.isFiltered()
    },
    clearFilter: function () {
        this.continuous = this.originalContinuous;
        this.tickStore.clearFilter()
    },
    generateTicks: function (a, d, g, i) {
        var h = [],
            f, b = Sch.util.Date,
            e = 0;
        g = g || this.unit;
        i = i || this.increment;
        if (this.autoAdjust) {
            a = this.floorDate(a || this.getStart(), false);
            d = this.ceilDate(d || b.add(a, this.mainUnit, this.defaultSpan), false)
        }
        while (a < d) {
            f = this.getNext(a, g, i);
            if (g === b.HOUR && i > 1 && h.length > 0 && e === 0) {
                var c = h[h.length - 1];
                e = ((c.start.getHours() + i) % 24) - c.end.getHours();
                if (e !== 0) {
                    f = b.add(f, b.HOUR, e)
                }
            }
            h.push({
                start: a,
                end: f
            });
            a = f
        }
        return h
    },
    getTickFromDate: function (c) {
        if (this.getStart() > c || this.getEnd() < c) {
            return -1
        }
        var f = this.tickStore.getRange(),
            e, a, d, b;
        for (d = 0, b = f.length; d < b; d++) {
            a = f[d].data.end;
            if (c <= a) {
                e = f[d].data.start;
                return d + (c > e ? (c - e) / (a - e) : 0)
            }
        }
        return -1
    },
    getDateFromTick: function (d, f) {
        var g = this.tickStore.getCount();
        if (d === g) {
            return this.getEnd()
        }
        var a = Math.floor(d),
            e = d - a,
            c = this.getAt(a);
        var b = Sch.util.Date.add(c.start, Sch.util.Date.MILLI, e * (c.end - c.start));
        if (f) {
            b = this[f + "Date"](b)
        }
        return b
    },
    getAt: function (a) {
        return this.tickStore.getAt(a).data
    },
    getCount: function () {
        return this.tickStore.getCount()
    },
    getTicks: function () {
        var a = [];
        this.tickStore.each(function (b) {
            a.push(b.data)
        });
        return a
    },
    getStart: function () {
        return Ext.Date.clone(this.tickStore.first().data.start)
    },
    getEnd: function () {
        return Ext.Date.clone(this.tickStore.last().data.end)
    },
    roundDate: function (r) {
        var l = Ext.Date.clone(r),
            b = this.getStart(),
            s = this.resolutionIncrement;
        switch (this.resolutionUnit) {
        case Sch.util.Date.MILLI:
            var e = Sch.util.Date.getDurationInMilliseconds(b, l),
                d = Math.round(e / s) * s;
            l = Sch.util.Date.add(b, Sch.util.Date.MILLI, d);
            break;
        case Sch.util.Date.SECOND:
            var i = Sch.util.Date.getDurationInSeconds(b, l),
                q = Math.round(i / s) * s;
            l = Sch.util.Date.add(b, Sch.util.Date.MILLI, q * 1000);
            break;
        case Sch.util.Date.MINUTE:
            var n = Sch.util.Date.getDurationInMinutes(b, l),
                a = Math.round(n / s) * s;
            l = Sch.util.Date.add(b, Sch.util.Date.SECOND, a * 60);
            break;
        case Sch.util.Date.HOUR:
            var m = Sch.util.Date.getDurationInHours(this.getStart(), l),
                j = Math.round(m / s) * s;
            l = Sch.util.Date.add(b, Sch.util.Date.MINUTE, j * 60);
            break;
        case Sch.util.Date.DAY:
            var c = Sch.util.Date.getDurationInDays(b, l),
                f = Math.round(c / s) * s;
            l = Sch.util.Date.add(b, Sch.util.Date.DAY, f);
            break;
        case Sch.util.Date.WEEK:
            Ext.Date.clearTime(l);
            var o = l.getDay() - this.weekStartDay,
                t;
            if (o < 0) {
                o = 7 + o
            }
            if (Math.round(o / 7) === 1) {
                t = 7 - o
            } else {
                t = -o
            }
            l = Sch.util.Date.add(l, Sch.util.Date.DAY, t);
            break;
        case Sch.util.Date.MONTH:
            var p = Sch.util.Date.getDurationInMonths(b, l) + (l.getDate() / Ext.Date.getDaysInMonth(l)),
                h = Math.round(p / s) * s;
            l = Sch.util.Date.add(b, Sch.util.Date.MONTH, h);
            break;
        case Sch.util.Date.QUARTER:
            Ext.Date.clearTime(l);
            l.setDate(1);
            l = Sch.util.Date.add(l, Sch.util.Date.MONTH, 3 - (l.getMonth() % 3));
            break;
        case Sch.util.Date.YEAR:
            var k = Sch.util.Date.getDurationInYears(b, l),
                g = Math.round(k / s) * s;
            l = Sch.util.Date.add(b, Sch.util.Date.YEAR, g);
            break
        }
        return l
    },
    floorDate: function (t, d, v) {
        d = d !== false;
        var n = Ext.Date.clone(t),
            b = d ? this.getStart() : null,
            u = this.resolutionIncrement,
            k;
        if (v) {
            k = v
        } else {
            k = d ? this.resolutionUnit : this.mainUnit
        }
        switch (k) {
        case Sch.util.Date.MILLI:
            if (d) {
                var f = Sch.util.Date.getDurationInMilliseconds(b, n),
                    e = Math.floor(f / u) * u;
                n = Sch.util.Date.add(b, Sch.util.Date.MILLI, e)
            }
            break;
        case Sch.util.Date.SECOND:
            if (d) {
                var j = Sch.util.Date.getDurationInSeconds(b, n),
                    s = Math.floor(j / u) * u;
                n = Sch.util.Date.add(b, Sch.util.Date.MILLI, s * 1000)
            } else {
                n.setMilliseconds(0)
            }
            break;
        case Sch.util.Date.MINUTE:
            if (d) {
                var p = Sch.util.Date.getDurationInMinutes(b, n),
                    a = Math.floor(p / u) * u;
                n = Sch.util.Date.add(b, Sch.util.Date.SECOND, a * 60)
            } else {
                n.setSeconds(0);
                n.setMilliseconds(0)
            }
            break;
        case Sch.util.Date.HOUR:
            if (d) {
                var o = Sch.util.Date.getDurationInHours(this.getStart(), n),
                    l = Math.floor(o / u) * u;
                n = Sch.util.Date.add(b, Sch.util.Date.MINUTE, l * 60)
            } else {
                n.setMinutes(0);
                n.setSeconds(0);
                n.setMilliseconds(0)
            }
            break;
        case Sch.util.Date.DAY:
            if (d) {
                var c = Sch.util.Date.getDurationInDays(b, n),
                    g = Math.floor(c / u) * u;
                n = Sch.util.Date.add(b, Sch.util.Date.DAY, g)
            } else {
                Ext.Date.clearTime(n)
            }
            break;
        case Sch.util.Date.WEEK:
            var r = n.getDay();
            Ext.Date.clearTime(n);
            if (r !== this.weekStartDay) {
                n = Sch.util.Date.add(n, Sch.util.Date.DAY, - (r > this.weekStartDay ? (r - this.weekStartDay) : (7 - r - this.weekStartDay)))
            }
            break;
        case Sch.util.Date.MONTH:
            if (d) {
                var q = Sch.util.Date.getDurationInMonths(b, n),
                    i = Math.floor(q / u) * u;
                n = Sch.util.Date.add(b, Sch.util.Date.MONTH, i)
            } else {
                Ext.Date.clearTime(n);
                n.setDate(1)
            }
            break;
        case Sch.util.Date.QUARTER:
            Ext.Date.clearTime(n);
            n.setDate(1);
            n = Sch.util.Date.add(n, Sch.util.Date.MONTH, - (n.getMonth() % 3));
            break;
        case Sch.util.Date.YEAR:
            if (d) {
                var m = Sch.util.Date.getDurationInYears(b, n),
                    h = Math.floor(m / u) * u;
                n = Sch.util.Date.add(b, Sch.util.Date.YEAR, h)
            } else {
                n = new Date(t.getFullYear(), 0, 1)
            }
            break
        }
        return n
    },
    ceilDate: function (c, b, f) {
        var e = Ext.Date.clone(c);
        b = b !== false;
        var a = b ? this.resolutionIncrement : 1,
            g = false,
            d;
        if (f) {
            d = f
        } else {
            d = b ? this.resolutionUnit : this.mainUnit
        }
        switch (d) {
        case Sch.util.Date.DAY:
            if (e.getMinutes() > 0 || e.getSeconds() > 0 || e.getMilliseconds() > 0) {
                g = true
            }
            break;
        case Sch.util.Date.WEEK:
            Ext.Date.clearTime(e);
            if (e.getDay() !== this.weekStartDay) {
                g = true
            }
            break;
        case Sch.util.Date.MONTH:
            Ext.Date.clearTime(e);
            if (e.getDate() !== 1) {
                g = true
            }
            break;
        case Sch.util.Date.QUARTER:
            Ext.Date.clearTime(e);
            if (e.getMonth() % 3 !== 0) {
                g = true
            }
            break;
        case Sch.util.Date.YEAR:
            Ext.Date.clearTime(e);
            if (e.getMonth() !== 0 && e.getDate() !== 1) {
                g = true
            }
            break;
        default:
            break
        }
        if (g) {
            return this.getNext(e, d, a)
        } else {
            return e
        }
    },
    getNext: function (b, c, a) {
        return Sch.util.Date.getNext(b, c, a, this.weekStartDay)
    },
    getResolution: function () {
        return {
            unit: this.resolutionUnit,
            increment: this.resolutionIncrement
        }
    },
    setResolution: function (b, a) {
        this.resolutionUnit = b;
        this.resolutionIncrement = a || 1
    },
    shiftNext: function (a) {
        a = a || this.getShiftIncrement();
        var b = this.getShiftUnit();
        this.setTimeSpan(Sch.util.Date.add(this.getStart(), b, a), Sch.util.Date.add(this.getEnd(), b, a))
    },
    shiftPrevious: function (a) {
        a = -(a || this.getShiftIncrement());
        var b = this.getShiftUnit();
        this.setTimeSpan(Sch.util.Date.add(this.getStart(), b, a), Sch.util.Date.add(this.getEnd(), b, a))
    },
    getShiftUnit: function () {
        return this.shiftUnit || this.getMainUnit()
    },
    getShiftIncrement: function () {
        return this.shiftIncrement || 1
    },
    getUnit: function () {
        return this.unit
    },
    getIncrement: function () {
        return this.increment
    },
    timeSpanInAxis: function (b, a) {
        if (this.continuous) {
            return Sch.util.Date.intersectSpans(b, a, this.getStart(), this.getEnd())
        } else {
            return a > b && this.getTickFromDate(b) !== this.getTickFromDate(a)
        }
    },
    forEachInterval: function (b, a, c) {
        c = c || this;
        if (b === "top" || (b === "middle" && this.headerConfig.bottom)) {
            this.forEachAuxInterval(b, a, c)
        } else {
            this.tickStore.each(function (e, d) {
                return a.call(c, e.data.start, e.data.end, d)
            })
        }
    },
    forEachMainInterval: function (a, b) {
        this.forEachInterval("middle", a, b)
    },
    forEachAuxInterval: function (b, a, f) {
        f = f || this;
        var c = this.getEnd(),
            g = this.getStart(),
            e = 0,
            d;
        while (g < c) {
            d = Sch.util.Date.min(this.getNext(g, this.headerConfig[b].unit, this.headerConfig[b].increment || 1), c);
            a.call(f, g, d, e);
            g = d;
            e++
        }
    }
});
Ext.define("Sch.preset.Manager", {
    extend: "Ext.util.MixedCollection",
    requires: ["Sch.util.Date", "Sch.util.HeaderRenderers"],
    singleton: true,
    constructor: function () {
        this.callParent(arguments);
        this.registerDefaults()
    },
    registerPreset: function (b, a) {
        if (a) {
            var c = a.headerConfig;
            var d = Sch.util.Date;
            for (var e in c) {
                if (c.hasOwnProperty(e)) {
                    if (d[c[e].unit]) {
                        c[e].unit = d[c[e].unit.toUpperCase()]
                    }
                }
            }
            if (!a.timeColumnWidth) {
                a.timeColumnWidth = 50
            }
            if (a.timeResolution && d[a.timeResolution.unit]) {
                a.timeResolution.unit = d[a.timeResolution.unit.toUpperCase()]
            }
            if (a.shiftUnit && d[a.shiftUnit]) {
                a.shiftUnit = d[a.shiftUnit.toUpperCase()]
            }
        }
        if (this.isValidPreset(a)) {
            if (this.containsKey(b)) {
                this.removeAtKey(b)
            }
            this.add(b, a)
        } else {
            throw "Invalid preset, please check your configuration"
        }
    },
    isValidPreset: function (a) {
        var d = Sch.util.Date,
            b = true,
            c = Sch.util.Date.units;
        for (var e in a.headerConfig) {
            if (a.headerConfig.hasOwnProperty(e)) {
                b = b && Ext.Array.indexOf(c, a.headerConfig[e].unit) >= 0
            }
        }
        if (a.timeResolution) {
            b = b && Ext.Array.indexOf(c, a.timeResolution.unit) >= 0
        }
        if (a.shiftUnit) {
            b = b && Ext.Array.indexOf(c, a.shiftUnit) >= 0
        }
        return b
    },
    getPreset: function (a) {
        return this.get(a)
    },
    deletePreset: function (a) {
        this.removeAtKey(a)
    },
    registerDefaults: function () {
        var b = this,
            a = this.defaultPresets;
        for (var c in a) {
            b.registerPreset(c, a[c])
        }
    },
    defaultPresets: {
        minuteAndHour: {
            timeColumnWidth: 100,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "G:i",
            shiftIncrement: 1,
            shiftUnit: "HOUR",
            defaultSpan: 24,
            timeResolution: {
                unit: "MINUTE",
                increment: 30
            },
            headerConfig: {
                middle: {
                    unit: "MINUTE",
                    increment: "30",
                    dateFormat: "i"
                },
                top: {
                    unit: "HOUR",
                    dateFormat: "D, GA/m"
                }
            }
        },
        hourAndDay: {
            timeColumnWidth: 60,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "G:i",
            shiftIncrement: 1,
            shiftUnit: "DAY",
            defaultSpan: 24,
            timeResolution: {
                unit: "MINUTE",
                increment: 30
            },
            headerConfig: {
                middle: {
                    unit: "HOUR",
                    dateFormat: "G:i"
                },
                top: {
                    unit: "DAY",
                    dateFormat: "D d/m"
                }
            }
        },
        dayAndWeek: {
            timeColumnWidth: 100,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "Y-m-d G:i",
            shiftUnit: "DAY",
            shiftIncrement: 1,
            defaultSpan: 5,
            timeResolution: {
                unit: "HOUR",
                increment: 1
            },
            headerConfig: {
                middle: {
                    unit: "DAY",
                    dateFormat: "D d M"
                },
                top: {
                    unit: "WEEK",
                    dateFormat: "W M Y",
                    renderer: function (c, b, a) {
                        return Sch.util.Date.getShortNameOfUnit("WEEK") + "." + Ext.Date.format(c, "W M Y")
                    }
                }
            }
        },
        weekAndDay: {
            timeColumnWidth: 100,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "G:i",
            shiftIncrement: 1,
            shiftUnit: "HOUR",
            defaultSpan: 24,
            timeResolution: {
                unit: "MINUTE",
                increment: 30
            },
            headerConfig: {
                middle: {
                    unit: "MINUTE",
                    increment: "30",
                    dateFormat: "i"
                },
                top: {
                    unit: "HOUR",
                    dateFormat: "D, GA/m"
                }
            }
        },
        hourAndDay: {
            timeColumnWidth: 100,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "G:i",
            shiftIncrement: 1,
            shiftUnit: "DAY",
            defaultSpan: 24,
            timeResolution: {
                unit: "MINUTE",
                increment: 30
            },
            headerConfig: {
                middle: {
                    unit: "HOUR",
                    dateFormat: "G:i"
                },
                top: {
                    unit: "DAY",
                    dateFormat: "D d/m"
                }
            }
        },
        dayAndWeek: {
            timeColumnWidth: 60,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "Y-m-d G:i",
            shiftUnit: "DAY",
            shiftIncrement: 1,
            defaultSpan: 5,
            timeResolution: {
                unit: "HOUR",
                increment: 1
            },
            headerConfig: {
                middle: {
                    unit: "DAY",
                    dateFormat: "D d M"
                },
                top: {
                    unit: "WEEK",
                    dateFormat: "W M Y",
                    renderer: function (c, b, a) {
                        return Sch.util.Date.getShortNameOfUnit("WEEK") + "." + Ext.Date.format(c, "W M Y")
                    }
                }
            }
        },
        weekAndDay: {
            timeColumnWidth: 40,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "Y-m-d",
            shiftUnit: "WEEK",
            shiftIncrement: 1,
            defaultSpan: 1,
            timeResolution: {
                unit: "DAY",
                increment: 1
            },
            headerConfig: {
                bottom: {
                    unit: "DAY",
                    increment: 1,
                    dateFormat: "d/m"
                },
                middle: {
                    unit: "WEEK",
                    dateFormat: "D d M",
                    align: "left"
                }
            }
        },
        weekAndMonth: {
            timeColumnWidth: 100,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "Y-m-d",
            shiftUnit: "WEEK",
            shiftIncrement: 5,
            defaultSpan: 6,
            timeResolution: {
                unit: "DAY",
                increment: 1
            },
            headerConfig: {
                middle: {
                    unit: "WEEK",
                    renderer: function (c, b, a) {
                        a.align = "left";
                        return Ext.Date.format(c, "d M")
                    }
                },
                top: {
                    unit: "MONTH",
                    dateFormat: "M Y"
                }
            }
        },
        monthAndYear: {
            timeColumnWidth: 110,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "Y-m-d",
            shiftIncrement: 3,
            shiftUnit: "MONTH",
            defaultSpan: 12,
            timeResolution: {
                unit: "DAY",
                increment: 1
            },
            headerConfig: {
                middle: {
                    unit: "MONTH",
                    dateFormat: "M Y"
                },
                top: {
                    unit: "YEAR",
                    dateFormat: "Y"
                }
            }
        },
        year: {
            timeColumnWidth: 100,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "Y-m-d",
            shiftUnit: "YEAR",
            shiftIncrement: 1,
            defaultSpan: 1,
            timeResolution: {
                unit: "MONTH",
                increment: 1
            },
            headerConfig: {
                bottom: {
                    unit: "QUARTER",
                    renderer: function (c, b, a) {
                        return Ext.String.format(Sch.util.Date.getShortNameOfUnit("QUARTER").toUpperCase() + "{0}", Math.floor(c.getMonth() / 3) + 1)
                    }
                },
                middle: {
                    unit: "YEAR",
                    dateFormat: "Y"
                }
            }
        },
        weekAndDayLetter: {
            timeColumnWidth: 20,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "Y-m-d",
            shiftUnit: "WEEK",
            shiftIncrement: 1,
            defaultSpan: 10,
            timeResolution: {
                unit: "DAY",
                increment: 1
            },
            headerConfig: {
                bottom: {
                    unit: "DAY",
                    increment: 1,
                    renderer: function (a) {
                        return Ext.Date.dayNames[a.getDay()].substring(0, 1)
                    }
                },
                middle: {
                    unit: "WEEK",
                    dateFormat: "D d M Y",
                    align: "left"
                }
            }
        },
        weekDateAndMonth: {
            timeColumnWidth: 30,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "Y-m-d",
            shiftUnit: "WEEK",
            shiftIncrement: 1,
            defaultSpan: 10,
            timeResolution: {
                unit: "DAY",
                increment: 1
            },
            headerConfig: {
                middle: {
                    unit: "WEEK",
                    dateFormat: "d"
                },
                top: {
                    unit: "MONTH",
                    dateFormat: "Y F",
                    align: "left"
                }
            }
        }
    }
});
Ext.define("Sch.feature.AbstractTimeSpan", {
    extend: "Ext.AbstractPlugin",
    lockableScope: "normal",
    schedulerView: null,
    timeAxis: null,
    containerEl: null,
    expandToFitView: false,
    disabled: false,
    cls: null,
    template: null,
    store: null,
    renderElementsBuffered: false,
    renderDelay: 15,
    constructor: function (a) {
        this.uniqueCls = this.uniqueCls || ("sch-timespangroup-" + Ext.id());
        Ext.apply(this, a)
    },
    setDisabled: function (a) {
        if (a) {
            this.removeElements()
        }
        this.disabled = a
    },
    getElements: function () {
        if (this.containerEl) {
            return this.containerEl.select("." + this.uniqueCls)
        }
        return null
    },
    removeElements: function () {
        var a = this.getElements();
        if (a) {
            a.remove()
        }
    },
    init: function (a) {
        this.timeAxis = a.getTimeAxis();
        this.schedulerView = a.getSchedulingView();
        if (!this.store) {
            Ext.Error.raise("Error: You must define a store for this plugin")
        }
        this.schedulerView.on({
            afterrender: this.onAfterRender,
            destroy: this.onDestroy,
            scope: this
        })
    },
    onAfterRender: function (b) {
        var a = this.schedulerView;
        this.containerEl = a.el;
        a.mon(this.store, {
            load: this.renderElements,
            datachanged: this.renderElements,
            clear: this.renderElements,
            add: this.renderElements,
            remove: this.renderElements,
            update: this.refreshSingle,
            scope: this
        });
        if (Ext.data.NodeStore && a.store instanceof Ext.data.NodeStore) {
            if (a.animate) {} else {
                a.mon(a.store, {
                    expand: this.renderElements,
                    collapse: this.renderElements,
                    scope: this
                })
            }
        }
        a.on({
            refresh: this.renderElements,
            itemadd: this.renderElements,
            itemremove: this.renderElements,
            itemupdate: this.renderElements,
            groupexpand: this.renderElements,
            groupcollapse: this.renderElements,
            columnwidthchange: this.renderElements,
            resize: this.renderElements,
            scope: this
        });
        a.headerCt.on({
            add: this.renderElements,
            remove: this.renderElements,
            scope: this
        });
        a.ownerCt.up("panel").on({
            viewchange: this.renderElements,
            orientationchange: this.renderElements,
            scope: this
        });
        this.renderElements()
    },
    renderElements: function () {
        if (this.renderElementsBuffered || this.disabled || this.schedulerView.headerCt.getColumnCount() === 0) {
            return
        }
        this.renderElementsBuffered = true;
        Ext.Function.defer(this.renderElementsInternal, this.renderDelay, this)
    },
    renderElementsInternal: function () {
        this.renderElementsBuffered = false;
        if (this.disabled || this.schedulerView.isDestroyed || this.schedulerView.headerCt.getColumnCount() === 0) {
            return
        }
        this.removeElements();
        var c = this.timeAxis.getStart(),
            a = this.timeAxis.getEnd(),
            b = this.getElementData(c, a);
        this.template.insertFirst(this.containerEl, b)
    },
    getElementData: function (b, a) {
        throw "Abstract method call"
    },
    onDestroy: function () {
        if (this.store.autoDestroy) {
            this.store.destroy()
        }
    },
    refreshSingle: function (c, b) {
        var e = Ext.get(this.uniqueCls + "-" + b.internalId);
        if (e) {
            var g = this.timeAxis.getStart(),
                a = this.timeAxis.getEnd(),
                f = this.getElementData(g, a, [b])[0],
                d = b.clsField || "Cls";
            e.dom.className = this.cls + " " + this.uniqueCls + " " + (f[d] || "");
            e.setTop(f.top);
            e.setLeft(f.left);
            e.setSize(f.width, f.height)
        } else {
            this.renderElements()
        }
    }
});
Ext.define("Sch.plugin.Lines", {
    extend: "Sch.feature.AbstractTimeSpan",
    cls: "sch-timeline",
    showTip: true,
    innerTpl: null,
    init: function (b) {
        this.callParent(arguments);
        var a = this.schedulerView;
        if (Ext.isString(this.innerTpl)) {
            this.innerTpl = new Ext.XTemplate(this.innerTpl)
        }
        var c = this.innerTpl;
        if (!this.template) {
            this.template = new Ext.XTemplate('<tpl for=".">', '<div id="' + this.uniqueCls + '-{id}"' + (this.showTip ? 'title="{[this.getTipText(values)]}" ' : "") + 'class="' + this.cls + " " + this.uniqueCls + ' {Cls}" style="left:{left}px;top:{top}px;height:{height}px;width:{width}px">' + (c ? "{[this.renderInner(values)]}" : "") + "</div>", "</tpl>", {
                getTipText: function (d) {
                    return a.getFormattedDate(d.Date) + " " + (d.Text || "")
                },
                renderInner: function (d) {
                    return c.apply(d)
                }
            })
        }
    },
    getElementData: function (k, n, d) {
        var p = this.store,
            j = this.schedulerView,
            f = d || p.getRange(),
            h = [],
            o = this.containerEl.lastBox ? this.containerEl.lastBox.height : this.containerEl.getHeight(),
            a, c, m, b;
        for (var g = 0, e = f.length; g < e; g++) {
            a = f[g];
            c = a.get("Date");
            if (c && Ext.Date.between(c, k, n)) {
                m = j.getTimeSpanRegion(c, null, this.expandToFitView);
                h[h.length] = Ext.apply({
                    id: a.internalId,
                    left: m.left,
                    top: m.top,
                    width: Math.max(1, m.right - m.left),
                    height: m.bottom - m.top
                }, a.data)
            }
        }
        return h
    }
});
Ext.define("Sch.plugin.Zones", {
    extend: "Sch.feature.AbstractTimeSpan",
    innerTpl: null,
    requires: ["Sch.model.Range"],
    cls: "sch-zone",
    init: function (a) {
        if (Ext.isString(this.innerTpl)) {
            this.innerTpl = new Ext.XTemplate(this.innerTpl)
        }
        var b = this.innerTpl;
        if (!this.template) {
            this.template = new Ext.XTemplate('<tpl for="."><div id="' + this.uniqueCls + '-{id}" class="' + this.cls + " " + this.uniqueCls + ' {Cls}" style="left:{left}px;top:{top}px;height:{height}px;width:{width}px">' + (b ? "{[this.renderInner(values)]}" : "") + "</div></tpl>", {
                renderInner: function (c) {
                    return b.apply(c)
                }
            })
        }
        this.callParent(arguments)
    },
    getElementData: function (j, n, c) {
        var o = this.store,
            h = this.schedulerView,
            e = c || o.getRange(),
            g = [],
            a, m, b, k;
        for (var f = 0, d = e.length; f < d; f++) {
            a = e[f];
            m = a.getStartDate();
            b = a.getEndDate();
            if (m && b && Sch.util.Date.intersectSpans(m, b, j, n)) {
                k = h.getTimeSpanRegion(Sch.util.Date.max(m, j), Sch.util.Date.min(b, n), this.expandToFitView);
                g[g.length] = Ext.apply({
                    id: a.internalId,
                    left: k.left,
                    top: k.top,
                    width: k.right - k.left,
                    height: k.bottom - k.top,
                    Cls: a.getCls()
                }, a.data)
            }
        }
        return g
    }
});
Ext.define("Sch.plugin.Pan", {
    alias: "plugin.pan",
    extend: "Ext.AbstractPlugin",
    lockableScope: "normal",
    enableVerticalPan: true,
    panel: null,
    constructor: function (a) {
        Ext.apply(this, a)
    },
    init: function (a) {
        this.panel = a.normalGrid || a;
        this.view = a.getSchedulingView();
        this.view.on("afterrender", this.onRender, this)
    },
    onRender: function (a) {
        this.view.el.on("mousedown", this.onMouseDown, this, {
            delegate: "." + this.view.timeCellCls
        })
    },
    onMouseDown: function (b, a) {
        if (b.getTarget("." + this.view.timeCellCls) && !b.getTarget(this.view.eventSelector)) {
            this.mouseX = b.getPageX();
            this.mouseY = b.getPageY();
            Ext.getBody().on("mousemove", this.onMouseMove, this);
            Ext.getDoc().on("mouseup", this.onMouseUp, this)
        }
    },
    onMouseMove: function (d) {
        d.stopEvent();
        var a = d.getPageX(),
            f = d.getPageY(),
            c = a - this.mouseX,
            b = f - this.mouseY;
        this.panel.scrollByDeltaX(-c);
        this.mouseX = a;
        this.mouseY = f;
        if (this.enableVerticalPan) {
            this.panel.scrollByDeltaY(-b)
        }
    },
    onMouseUp: function (a) {
        Ext.getBody().un("mousemove", this.onMouseMove, this);
        Ext.getDoc().un("mouseup", this.onMouseUp, this)
    }
});
Ext.define("Sch.view.Locking", {
    extend: "Ext.grid.LockingView",
    scheduleEventRelayRe: /^(schedule|event|beforeevent|afterevent|dragcreate|beforedragcreate|afterdragcreate|beforetooltipshow)/,
    constructor: function (b) {
        this.callParent(arguments);
        var e = this,
            g = [],
            a = e.scheduleEventRelayRe,
            f = b.normal.getView(),
            c = f.events,
            d;
        for (d in c) {
            if (c.hasOwnProperty(d) && a.test(d)) {
                g.push(d)
            }
        }
        e.relayEvents(f, g)
    },
    getElementFromEventRecord: function (a) {
        return this.normal.getView().getElementFromEventRecord(a)
    },
    onClear: function () {
        this.relayFn("onClear", arguments)
    },
    beginBulkUpdate: function () {
        this.relayFn("beginBulkUpdate", arguments)
    },
    endBulkUpdate: function () {
        this.relayFn("endBulkUpdate", arguments)
    },
    refreshKeepingScroll: function () {
        this.locked.getView().refresh();
        this.normal.getView().refreshKeepingScroll()
    }
});
Ext.define("Sch.column.Time", {
    extend: "Ext.grid.column.Column",
    alias: "timecolumn",
    draggable: false,
    groupable: false,
    hideable: false,
    sortable: false,
    fixed: true,
    align: "center",
    tdCls: "sch-timetd",
    menuDisabled: true,
    initComponent: function () {
        this.addEvents("timeheaderdblclick");
        this.enableBubble("timeheaderdblclick");
        this.callParent()
    },
    initRenderData: function () {
        var a = this;
        a.renderData.headerCls = a.renderData.headerCls || a.headerCls;
        return a.callParent(arguments)
    },
    onElDblClick: function (b, a) {
        this.callParent(arguments);
        this.fireEvent("timeheaderdblclick", this, this.startDate, this.endDate, b)
    }
}, function () {
    Sch.column.Time.prototype.renderTpl = Sch.column.Time.prototype.renderTpl.replace("column-header-inner", "column-header-inner sch-timeheader {headerCls}")
});
Ext.define("Sch.column.timeAxis.Horizontal", {
    extend: "Ext.grid.column.Column",
    alias: "widget.timeaxiscolumn",
    requires: ["Ext.Date", "Ext.XTemplate", "Sch.column.Time", "Sch.preset.Manager"],
    cls: "sch-timeaxiscolumn",
    timeAxis: null,
    renderTpl: '<div id="{id}-titleEl" class="' + Ext.baseCSSPrefix + 'column-header-inner"><span id="{id}-textEl" style="display:none" class="' + Ext.baseCSSPrefix + 'column-header-text"></span><tpl if="topHeaderCells">{topHeaderCells}</tpl><tpl if="middleHeaderCells">{middleHeaderCells}</tpl></div>{%this.renderContainer(out,values)%}',
    headerRowTpl: '<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}" class="sch-header-row sch-header-row-{position}"><thead><tr>{cells}</tr></thead></table>',
    headerCellTpl: '<tpl for="."><td class="sch-column-header x-column-header {headerCls}" style="position : static; text-align: {align}; {style}" tabIndex="0" id="{headerId}" headerPosition="{position}" headerIndex="{index}"><div class="x-column-header-inner">{header}</div></td></tpl>',
    columnConfig: {},
    timeCellRenderer: null,
    timeCellRendererScope: null,
    columnWidth: null,
    previousWidth: null,
    previousHeight: null,
    initComponent: function () {
        if (!(this.headerRowTpl instanceof Ext.Template)) {
            this.headerRowTpl = Ext.create("Ext.XTemplate", this.headerRowTpl)
        }
        if (!(this.headerCellTpl instanceof Ext.Template)) {
            this.headerCellTpl = Ext.create("Ext.XTemplate", this.headerCellTpl)
        }
        this.columns = [{}];
        this.addEvents("timeheaderdblclick", "timeaxiscolumnreconfigured");
        this.enableBubble("timeheaderdblclick");
        this.stubForResizer = new Ext.Component({
            isOnLeftEdge: function () {
                return false
            },
            isOnRightEdge: function () {
                return false
            },
            el: {
                dom: {
                    style: {}
                }
            }
        });
        this.callParent(arguments);
        this.onTimeAxisReconfigure();
        this.mon(this.timeAxis, "reconfigure", this.onTimeAxisReconfigure, this)
    },
    getSchedulingView: function () {
        return this.getOwnerHeaderCt().view
    },
    onTimeAxisReconfigure: function () {
        var e = this.timeAxis,
            d = e.preset.timeColumnWidth,
            f = this.rendered && this.getSchedulingView(),
            g = e.headerConfig,
            b = e.getStart(),
            c = e.getEnd(),
            h = {
                renderer: this.timeColumnRenderer,
                scope: this,
                width: this.rendered ? f.calculateTimeColumnWidth(d) : d
            };
        delete this.previousWidth;
        delete this.previousHeight;
        var j = this.columnConfig = this.createColumns(this.timeAxis, g, h);
        Ext.suspendLayouts();
        this.removeAll();
        if (this.rendered) {
            var a = this.el.child(".x-column-header-inner");
            a.select("table").remove();
            var i = this.initRenderData();
            if (j.top) {
                Ext.core.DomHelper.append(a, i.topHeaderCells)
            }
            if (j.middle) {
                Ext.core.DomHelper.append(a, i.middleHeaderCells)
            }
            if (!j.top && !j.middle) {
                this.addCls("sch-header-single-row")
            } else {
                this.removeCls("sch-header-single-row")
            }
        }
        Ext.resumeLayouts();
        this.add(j.bottom);
        if (this.rendered) {
            if (this.fireEvent("timeaxiscolumnreconfigured", this) !== false) {
                f.refresh()
            }
        }
    },
    beforeRender: function () {
        var a = this.columnConfig;
        if (!a.middle && !a.top) {
            this.addCls("sch-header-single-row")
        }
        this.callParent(arguments)
    },
    timeColumnRenderer: function (i, e, f, l, d, c, k) {
        var a = "";
        if (Ext.isIE) {
            e.style += ";z-index:" + (this.items.getCount() - d)
        }
        if (this.timeCellRenderer) {
            var h = this.timeAxis,
                b = h.getAt(d),
                g = b.start,
                j = b.end;
            a = this.timeCellRenderer.call(this.timeCellRendererScope || this, e, f, l, d, c, g, j)
        }
        return a
    },
    initRenderData: function () {
        var a = this.columnConfig;
        var c = a.top ? this.headerRowTpl.apply({
            cells: this.headerCellTpl.apply(a.top),
            position: "top",
            tstyle: "border-top : 0; width : 100px"
        }) : "";
        var b = a.middle ? this.headerRowTpl.apply({
            cells: this.headerCellTpl.apply(a.middle),
            position: "middle",
            tstyle: a.top ? "width : 100px" : "border-top : 0; width : 100px"
        }) : "";
        return Ext.apply(this.callParent(arguments), {
            topHeaderCells: c,
            middleHeaderCells: b
        })
    },
    defaultRenderer: function (c, b, a) {
        return Ext.Date.format(c, a)
    },
    createColumns: function (f, d, g) {
        if (!f || !d) {
            throw "Invalid parameters passed to createColumns"
        }
        var c = [],
            a = d.bottom || d.middle,
            h, e = this;
        f.forEachInterval(d.bottom ? "bottom" : "middle", function (l, j, k) {
            h = {
                align: a.align || "center",
                headerCls: "",
                startDate: l,
                endDate: j
            };
            if (a.renderer) {
                h.header = a.renderer.call(a.scope || e, l, j, h, k)
            } else {
                h.header = e.defaultRenderer(l, j, a.dateFormat)
            }
            c[c.length] = Ext.create("Sch.column.Time", Ext.apply(h, g))
        });
        var b = this.createHeaderRows(f, d);
        return {
            bottom: c,
            middle: b.middle,
            top: b.top
        }
    },
    createHeaderRows: function (e, c) {
        var d = {};
        if (c.top) {
            var a;
            if (c.top.cellGenerator) {
                a = c.top.cellGenerator.call(this, e.getStart(), e.getEnd())
            } else {
                a = this.createHeaderRow(e, c.top)
            }
            d.top = this.processHeaderRow(a, "top")
        }
        if (c.bottom) {
            var b;
            if (c.middle.cellGenerator) {
                b = c.middle.cellGenerator.call(this, e.getStart(), e.getEnd())
            } else {
                b = this.createHeaderRow(e, c.middle)
            }
            d.middle = this.processHeaderRow(b, "middle")
        }
        return d
    },
    processHeaderRow: function (c, a) {
        var b = this;
        Ext.each(c, function (d, e) {
            d.index = e;
            d.position = a;
            d.headerId = b.stubForResizer.id
        });
        return c
    },
    createHeaderRow: function (e, k) {
        var n = [],
            l, a = e.getStart(),
            c = e.getEnd(),
            m = c - a,
            j = [],
            b = a,
            d = 0,
            f, g = k.align || "center",
            h;
        while (b < c) {
            h = Sch.util.Date.min(e.getNext(b, k.unit, k.increment || 1), c);
            l = {
                align: g,
                start: b,
                end: h,
                headerCls: ""
            };
            if (k.renderer) {
                l.header = k.renderer.call(k.scope || this, b, h, l, d)
            } else {
                l.header = this.defaultRenderer(b, h, k.dateFormat, l, d)
            }
            n.push(l);
            b = h;
            d++
        }
        return n
    },
    afterLayout: function () {
        delete this.columnWidth;
        this.callParent(arguments);
        var b = this.getWidth();
        var g = this.getHeight();
        if (b === this.previousWidth && g === this.previousHeight) {
            return
        }
        this.previousWidth = b;
        this.previousHeight = g;
        var i = this.columnConfig;
        var e = this;
        var c = this.el;
        var f = i.top;
        var d = 0;
        var a = 0;
        if (f) {
            c.select(".sch-header-row-top").setWidth(this.lastBox.width);
            c.select(".sch-header-row-top td").each(function (l, m, j) {
                var k = e.getHeaderGroupCellWidth(f[j].start, f[j].end);
                l.setVisibilityMode(Ext.Element.DISPLAY);
                if (k) {
                    d += k;
                    l.show();
                    l.setWidth(k)
                } else {
                    l.hide()
                }
            })
        }
        var h = i.middle;
        if (h) {
            c.select(".sch-header-row-middle").setWidth(this.lastBox.width);
            c.select(".sch-header-row-middle td").each(function (l, m, j) {
                var k = e.getHeaderGroupCellWidth(h[j].start, h[j].end);
                l.setVisibilityMode(Ext.Element.DISPLAY);
                if (k) {
                    a += k;
                    l.show();
                    l.setWidth(k)
                } else {
                    l.hide()
                }
            })
        }
    },
    getHeaderGroupCellWidth: function (h, b) {
        var e = this.timeAxis.unit,
            d = this.timeAxis.increment,
            c, g = Sch.util.Date.getMeasuringUnit(e),
            a = Sch.util.Date.getDurationInUnit(h, b, g),
            f = this.getSchedulingView();
        if (this.timeAxis.isContinuous()) {
            c = a * f.getSingleUnitInPixels(g)
        } else {
            c = f.getXYFromDate(b)[0] - f.getXYFromDate(h)[0]
        }
        return c
    },
    onElDblClick: function (d, f) {
        this.callParent(arguments);
        var e = d.getTarget(".sch-column-header");
        if (e) {
            var a = Ext.fly(e).getAttribute("headerPosition"),
                b = Ext.fly(e).getAttribute("headerIndex"),
                c = this.columnConfig[a][b];
            this.fireEvent("timeheaderdblclick", this, c.start, c.end, d)
        }
    },
    getTimeColumnWidth: function () {
        if (this.columnWidth === null) {
            this.columnWidth = this.items.get(0).getWidth()
        }
        return this.columnWidth
    },
    setTimeColumnWidth: function (a) {
        this.suspendEvents();
        this.items.each(function (b) {
            b.setWidth(a)
        });
        this.resumeEvents()
    }
});
Ext.define("Sch.column.timeAxis.HorizontalSingle", {
    extend: "Sch.column.Time",
    alias: "widget.singletimeaxiscolumn",
    requires: ["Ext.Date", "Ext.XTemplate", "Sch.preset.Manager"],
    cls: "sch-simple-timeaxis",
    timeAxis: null,
    trackHeaderOver: true,
    compactCellWidthThreshold: 16,
    renderTpl: '<div id="{id}-titleEl" class="' + Ext.baseCSSPrefix + 'column-header-inner"><span id="{id}-textEl" style="display:none" class="' + Ext.baseCSSPrefix + 'column-header-text"></span><tpl if="topHeaderCells">{topHeaderCells}</tpl><tpl if="middleHeaderCells">{middleHeaderCells}</tpl><tpl if="bottomHeaderCells">{bottomHeaderCells}</tpl></div>{%this.renderContainer(out,values)%}',
    headerRowTpl: '<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}" class="sch-header-row sch-header-row-{position}"><thead><tr><tpl for="cells"><td class="sch-column-header x-column-header {headerCls}" style="position : static; text-align: {align}; {style}" tabIndex="0" id="{headerId}" headerPosition="{parent.position}" headerIndex="{[xindex-1]}"><div class="sch-simple-timeheader">{header}</div></td></tpl></tr></thead></table>',
    columnConfig: {},
    columnWidth: null,
    nbrTimeColumns: null,
    initComponent: function () {
        this.tdCls += " sch-singletimetd";
        if (!(this.headerRowTpl instanceof Ext.Template)) {
            this.headerRowTpl = Ext.create("Ext.XTemplate", this.headerRowTpl)
        }
        this.addEvents("timeheaderdblclick", "timeaxiscolumnreconfigured");
        this.enableBubble("timeheaderdblclick");
        this.callParent(arguments);
        this.onTimeAxisReconfigure();
        this.mon(this.timeAxis, "reconfigure", this.onTimeAxisReconfigure, this);
        this.on("resize", this.refreshHeaderSizes, this);
        this.ownHoverCls = this.hoverCls;
        this.hoverCls = ""
    },
    getSchedulingView: function () {
        return this.getOwnerHeaderCt().view
    },
    onTimeAxisReconfigure: function () {
        var h = this.timeAxis,
            g = h.preset.timeColumnWidth,
            j = this.rendered && this.getSchedulingView(),
            l = h.headerConfig,
            c = h.getStart(),
            f = h.getEnd(),
            d = this.rendered ? j.calculateTimeColumnWidth(g) : g;
        var o = this.columnConfig = this.createHeaderRows(l);
        var a = o.bottom || o.middle;
        if (this.rendered) {
            var e;
            var b = this.el.child(".x-column-header-inner");
            var i = b.dom;
            var k = i.style.display;
            var m = i.parentNode;
            i.style.display = "none";
            m.removeChild(i);
            i.innerHTML = "";
            var n = this.initRenderData();
            if (o.top) {
                e = Ext.core.DomHelper.append(b, n.topHeaderCells);
                this.refreshHeaderRow("top", e)
            }
            if (o.middle) {
                e = Ext.core.DomHelper.append(b, n.middleHeaderCells);
                this.refreshHeaderRow("middle", e)
            }
            if (o.bottom) {
                e = Ext.core.DomHelper.append(b, n.bottomHeaderCells);
                this.refreshHeaderRow("bottom", e)
            }
            if (!o.top && !o.middle) {
                this.addCls("sch-header-single-row")
            } else {
                this.removeCls("sch-header-single-row")
            }
            m.appendChild(i);
            i.style.display = k;
            if (d !== this.columnWidth || this.nbrTimeColumns !== a.length) {
                this.nbrTimeColumns = a.length;
                this.setTimeColumnWidth(d)
            }
            if (this.fireEvent("timeaxiscolumnreconfigured", this) !== false) {
                j.refreshKeepingResourceScroll(true)
            }
        } else {
            if (d !== this.columnWidth || this.nbrTimeColumns !== a.length) {
                this.nbrTimeColumns = a.length;
                this.setTimeColumnWidth(d)
            }
        }
    },
    beforeRender: function () {
        var b = this,
            a = this.columnConfig;
        if (!a.middle && !a.top) {
            b.addCls("sch-header-single-row")
        }
        b.callParent(arguments)
    },
    afterRender: function () {
        var a = this;
        if (this.trackHeaderOver) {
            a.el.on({
                mousemove: a.highlightCell,
                delegate: "div.sch-simple-timeheader",
                scope: a
            });
            a.el.on({
                mouseleave: a.clearHighlight,
                scope: a
            })
        }
        a.callParent(arguments)
    },
    initRenderData: function () {
        var a = this.columnConfig;
        var c = a.top ? this.headerRowTpl.apply({
            cells: a.top,
            position: "top",
            tstyle: "border-top : 0; width : 100px"
        }) : "";
        var b = a.middle ? this.headerRowTpl.apply({
            cells: a.middle,
            position: "middle",
            tstyle: a.top ? "width : 100px" : "border-top : 0; width : 100px"
        }) : "";
        var d = a.bottom ? this.headerRowTpl.apply({
            cells: a.bottom,
            position: "bottom",
            tstyle: "width : 100px"
        }) : "";
        return Ext.apply(this.callParent(arguments), {
            topHeaderCells: c,
            middleHeaderCells: b,
            bottomHeaderCells: d
        })
    },
    defaultRenderer: function (c, b, a) {
        return Ext.Date.format(c, a)
    },
    createHeaderRows: function (a) {
        var b = {};
        for (var c in a) {
            if (a[c].cellGenerator) {
                b[c] = a[c].cellGenerator.call(this, this.timeAxis.getStart(), this.timeAxis.getEnd())
            } else {
                b[c] = this.createHeaderRow(c, a[c])
            }
        }
        return b
    },
    createHeaderRow: function (a, c) {
        var b = [],
            d = this,
            f, e = c.align || "center";
        this.timeAxis.forEachInterval(a, function (j, g, h) {
            f = {
                align: e,
                start: j,
                end: g,
                headerCls: ""
            };
            if (c.renderer) {
                f.header = c.renderer.call(c.scope || d, j, g, f, h)
            } else {
                f.header = d.defaultRenderer(j, g, c.dateFormat, f, h)
            }
            if (c.unit === Sch.util.Date.DAY && (!c.increment || c.increment === 1)) {
                f.headerCls += " sch-dayheadercell-" + j.getDay()
            }
            b.push(f)
        });
        return b
    },
    afterLayout: function () {
        this.callParent(arguments);
        this.refreshHeaderSizes()
    },
    refreshHeaderSizes: function () {
        var a = this.columnConfig;
        if (a.top) {
            this.refreshHeaderRow("top")
        }
        if (a.middle) {
            this.refreshHeaderRow("middle")
        }
        if (a.bottom) {
            this.refreshHeaderRow("bottom")
        }
    },
    refreshHeaderRow: function (a, b) {
        var e = this.el;
        var f = this.columnConfig[a];
        var d = this;
        var c;
        b = b || e.down(".sch-header-row-" + a, true);
        Ext.fly(b).setWidth(d.getTotalWidth());
        Ext.fly(b).select(" thead > tr > td").each(function (h, i, g) {
            c = d.getHeaderGroupCellWidth(f[g].start, f[g].end);
            h.setVisibilityMode(Ext.Element.DISPLAY);
            if (c) {
                if (Ext.isSafari && Ext.isMac) {
                    c -= 2
                }
                h.show();
                h.setWidth(c - (Ext.chromeVersion === 19 ? (g ? 1 : 0) : 0))
            } else {
                h.hide()
            }
        });
        if (a === "bottom") {
            if (c < this.compactCellWidthThreshold) {
                Ext.fly(b).addCls("sch-header-row-compact")
            } else {
                Ext.fly(b).removeCls("sch-header-row-compact")
            }
        }
    },
    getHeaderGroupCellWidth: function (h, b) {
        var e = this.timeAxis.unit,
            d = this.timeAxis.increment,
            c, g = Sch.util.Date.getMeasuringUnit(e),
            a = Sch.util.Date.getDurationInUnit(h, b, g),
            f = this.getSchedulingView();
        if (this.timeAxis.isContinuous()) {
            c = a * f.getSingleUnitInPixels(g)
        } else {
            c = f.getXYFromDate(b)[0] - f.getXYFromDate(h)[0]
        }
        return c
    },
    onElDblClick: function (d, f) {
        var e = d.getTarget(".sch-column-header");
        if (e) {
            var a = Ext.fly(e).getAttribute("headerPosition"),
                b = Ext.fly(e).getAttribute("headerIndex"),
                c = this.columnConfig[a][b];
            this.fireEvent("timeheaderdblclick", this, c.start, c.end, d)
        }
    },
    getTimeColumnWidth: function () {
        if (this.columnWidth === null) {
            this.columnWidth = this.getWidth() / this.nbrTimeColumns
        }
        return this.columnWidth
    },
    setTimeColumnWidth: function (a) {
        this.columnWidth = a;
        if (this.rendered) {
            Ext.suspendLayouts();
            this.setWidth(a * this.nbrTimeColumns);
            Ext.resumeLayouts();
            this.refreshHeaderSizes();
            this.ownerCt.updateLayout()
        } else {
            this.setWidth(a * this.nbrTimeColumns)
        }
    },
    getTotalWidth: function () {
        return this.columnWidth * this.nbrTimeColumns
    },
    highlightCell: function (c, a) {
        var b = this;
        if (a !== b.highlightedCell) {
            b.clearHighlight();
            b.highlightedCell = a;
            Ext.fly(a).addCls(b.ownHoverCls)
        }
    },
    clearHighlight: function () {
        var b = this,
            a = b.highlightedCell;
        if (a) {
            Ext.fly(a).removeCls(b.ownHoverCls);
            delete b.highlightedCell
        }
    }
});
Ext.define("Sch.mixin.Lockable", {
    extend: "Ext.grid.Lockable",
    requires: ["Sch.column.timeAxis.Horizontal", "Sch.column.timeAxis.HorizontalSingle"],
    findEditingPlugin: function () {
        var b = this.plugins || [];
        var c = this;
        var a;
        Ext.each(b, function (e, d) {
            if (Ext.grid.plugin && Ext.grid.plugin.CellEditing && e instanceof Ext.grid.plugin.CellEditing) {
                a = e;
                Ext.Array.remove(b, e);
                return false
            }
        });
        return a
    },
    processSchedulerPlugins: function () {
        var e = [];
        var d = [];
        var g = [];
        var a = this.plugins || [];
        var c = this;
        for (var b = a.length - 1; b >= 0; b--) {
            var f = a[b];
            if (f.lockableScope) {
                switch (f.lockableScope) {
                case "top":
                    g.push(f);
                    break;
                case "locked":
                    e.push(f);
                    break;
                case "normal":
                    d.push(f);
                    break
                }
                Ext.Array.remove(a, f)
            }
        }
        if (e.length > 0) {
            c.lockedGridConfig.plugins = (c.lockedGridConfig.plugins || []).concat(e)
        }
        if (d.length > 0) {
            c.normalGridConfig.plugins = (c.normalGridConfig.plugins || []).concat(d)
        }
        c.topPlugins = g
    },
    injectLockable: function () {
        var d = this.findEditingPlugin();
        var i = this;
        var f = Ext.data.TreeStore && i.store instanceof Ext.data.TreeStore;
        var j = i.store.buffered;
        var c = i.getEventSelectionModel ? i.getEventSelectionModel() : i.getSelectionModel();
        i.lockedGridConfig = i.lockedGridConfig || {};
        i.normalGridConfig = i.schedulerConfig || i.normalGridConfig || {};
        var a = i.lockedGridConfig,
            h = i.normalGridConfig;
        Ext.applyIf(i.lockedGridConfig, {
            enableLocking: false,
            lockable: false,
            useArrows: true,
            xtype: i.lockedXType,
            columnLines: i.columnLines,
            rowLines: i.rowLines,
            stateful: i.stateful,
            id: i.id + "_locked",
            delayScroll: function () {
                if (this.rendered) {
                    return this.self.prototype.delayScroll.apply(this, arguments)
                }
            },
            split: true,
            animCollapse: false,
            collapseDirection: "left",
            region: "west"
        });
        if (d) {
            i.lockedGridConfig.plugins = (i.lockedGridConfig.plugins || []).concat(d)
        }
        i.processSchedulerPlugins();
        Ext.applyIf(i.normalGridConfig, {
            layout: "fit",
            xtype: i.normalXType,
            viewType: i.viewType,
            enableLocking: false,
            lockable: false,
            sortableColumns: false,
            enableColumnMove: false,
            enableColumnResize: false,
            enableColumnHide: false,
            selModel: c,
            eventSelModel: c,
            _top: i,
            orientation: i.orientation,
            viewPreset: i.viewPreset,
            timeAxis: i.timeAxis,
            columnLines: i.columnLines,
            rowLines: i.rowLines,
            collapseDirection: "right",
            animCollapse: false,
            region: "center"
        });
        i.bothCfgCopy = i.bothCfgCopy || (Ext.grid.Panel && Ext.grid.Panel.prototype.bothCfgCopy) || ["invalidateScrollerOnRefresh", "hideHeaders", "enableColumnHide", "enableColumnMove", "enableColumnResize", "sortableColumns"];
        if (i.orientation === "vertical") {
            a.store = h.store = i.timeAxis.tickStore;
            i.mon(i.resourceStore, {
                clear: i.refreshResourceColumns,
                datachanged: i.refreshResourceColumns,
                load: i.refreshResourceColumns,
                scope: i
            })
        }
        if (a.width) {
            i.syncLockedWidth = Ext.emptyFn;
            a.scroll = "horizontal";
            a.scrollerOwner = true
        }
        if (i.resourceStore) {
            h.resourceStore = i.resourceStore
        }
        if (i.eventStore) {
            h.eventStore = i.eventStore
        }
        if (i.dependencyStore) {
            h.dependencyStore = i.dependencyStore
        }
        i.lockedViewConfig = i.lockedViewConfig || {};
        i.normalViewConfig = i.normalViewConfig || {};
        if (f && j && Ext.getScrollbarSize().width === 0) {
            i.lockedGridConfig.scroll = "horizontal"
        }
        i.lockedViewConfig.enableAnimations = i.normalViewConfig.enableAnimations = false;
        if (f) {
            i.normalViewConfig.providedStore = i.lockedViewConfig.providedStore = i.createNodeStore(j, i.store)
        }
        var e = i.layout;
        this.callParent(arguments);
        if (i.topPlugins) {
            i.plugins = i.topPlugins
        }
        if (a.width) {
            i.lockedGrid.setWidth(a.width);
            i.normalGrid.getView().addCls("sch-timeline-horizontal-scroll")
        } else {
            if (i.normalGrid.collapsed) {
                i.normalGrid.collapsed = false;
                i.normalGrid.view.on("boxready", function () {
                    i.normalGrid.collapse()
                }, i, {
                    delay: 10
                })
            }
        }
        var k = i.lockedGrid.getView();
        var b = i.normalGrid.getView();
        if (j) {
            k.on("render", this.onLockedViewRender, this);
            this.fixPagingScroller(i.normalGrid.verticalScroller);
            if (Ext.getScrollbarSize().width > 0) {
                k.on({
                    scroll: {
                        fn: i.onLockedViewScroll,
                        element: "el",
                        scope: i
                    }
                })
            }
        }
        if (Ext.getScrollbarSize().width === 0) {
            k.addCls("sch-ganttpanel-force-locked-scroll")
        }
        if (f) {
            this.setupLockableTree()
        }
        if (!b.deferInitialRefresh) {
            var g = b.onRender;
            b.onRender = function () {
                this.doFirstRefresh = function () {};
                g.apply(this, arguments);
                delete this.doFirstRefresh
            }
        }
        if (j) {
            b.el = {
                un: function () {}
            };
            i.normalGrid.verticalScroller.bindView(b);
            delete b.el
        }
        i.view.clearListeners();
        k.on({
            refresh: i.updateSpacer,
            scope: i
        });
        i.view = Ext.create("Sch.view.Locking", {
            locked: i.lockedGrid,
            normal: i.normalGrid,
            panel: i
        });
        if (i.syncRowHeight) {
            k.on("refresh", this.onLockedViewRefresh, this);
            if (f) {
                i.mon(i.store, {
                    beforeload: function () {
                        k.un({
                            itemadd: i.onViewItemAdd,
                            scope: i
                        });
                        b.un({
                            itemadd: i.onViewItemAdd,
                            scope: i
                        })
                    },
                    load: function () {
                        k.un({
                            itemadd: i.onViewItemAdd,
                            scope: i
                        });
                        b.un({
                            itemadd: i.onViewItemAdd,
                            scope: i
                        });
                        i.prepareFullRowHeightSync();
                        i.syncRowHeights()
                    }
                });
                i.normalGrid.on("afteritemexpand", i.afterNormalGridItemExpand, i)
            }
            k.on({
                itemadd: i.onViewItemAdd,
                scope: i
            });
            b.on({
                itemadd: i.onViewItemAdd,
                itemupdate: i.onNormalViewItemUpdate,
                groupexpand: i.onNormalViewGroupExpand,
                scope: i
            });
            if (Ext.isIE9 && Ext.isStrict) {
                i.onNormalViewItemUpdate = function (l, m, o) {
                    if (i.lockedGridDependsOnSchedule) {
                        var n = i.lockedGrid.getView();
                        n.suspendEvents();
                        n.onUpdate(i.lockedGrid.store, l);
                        n.resumeEvents()
                    }
                    var p = i.normalGrid.getView().getNode(m);
                    p.style.height = o.style.height;
                    i.normalHeights[m] = o.style.height;
                    i.syncRowHeights()
                }
            }
        }
        if (e !== "fit") {
            i.layout = e
        }
        i.normalGrid.on({
            collapse: i.onNormalGridCollapse,
            expand: i.onNormalGridExpand,
            scope: i
        });
        i.lockedGrid.on({
            collapse: i.onLockedGridCollapse,
            scope: i
        });
        if (this.lockedGrid.view.store !== this.normalGrid.view.store) {
            Ext.Error.raise("Sch.mixin.Lockable setup failed, not sharing store between the two views")
        }
    },
    onLockedGridCollapse: function () {
        if (this.normalGrid.collapsed) {
            this.normalGrid.expand()
        }
    },
    onNormalGridCollapse: function () {
        var a = this;
        if (!a.normalGrid.reExpander) {
            a.normalGrid.reExpander = a.normalGrid.placeholder
        }
        if (!a.lockedGrid.rendered) {
            a.lockedGrid.on("render", a.onNormalGridCollapse, a, {
                delay: 1
            })
        } else {
            a.lastLockedWidth = a.lockedGrid.getWidth();
            a.lockedGrid.setWidth(a.getWidth() - 35);
            if (a.lockedGrid.collapsed) {
                a.lockedGrid.expand()
            }
            a.addCls("sch-normalgrid-collapsed")
        }
    },
    onNormalGridExpand: function () {
        this.removeCls("sch-normalgrid-collapsed");
        this.lockedGrid.setWidth(this.lastLockedWidth)
    },
    fixPagingScroller: function (a) {
        var b = a.onViewRefresh;
        a.onViewRefresh = function () {
            b.apply(this, arguments);
            var g = this,
                f = g.store;
            if (f.getCount() === f.getTotalCount() || (f.isFiltered() && !f.remoteFilter)) {
                g.stretcher.setHeight(g.getScrollHeight())
            }
        };
        var d = a.view.lockingPartner;
        if (d) {
            var e = a.onLockRefresh;
            var c = function (f) {
                if (f.table.dom) {
                    e.apply(this, arguments)
                }
            };
            d.un("refresh", e, a);
            d.on("refresh", c, a);
            a.onLockRefresh = c
        }
        a.view.un("render", a.onViewRender, a);
        a.onViewRender = function () {
            var g = this,
                f = g.view.el;
            f.setStyle("position", "relative");
            g.stretcher = f.createChild({
                style: {
                    position: "absolute",
                    width: "1px",
                    height: 0,
                    top: 0,
                    left: 0
                }
            }, f.dom.firstChild)
        };
        a.view.on("render", a.onViewRender, a)
    },
    createNodeStore: function (a, b) {
        return new Ext.data.NodeStore({
            buffered: a,
            purgePageCount: 0,
            pageSize: 10000000000,
            treeStore: b,
            recursive: true,
            refreshFromTree: function () {
                var e = this.eventsSuspended;
                this.suspendEvents();
                this.removeAll();
                var c = b.getRootNode(),
                    f = [];
                var d = function (i) {
                    if (i != c) {
                        f[f.length] = i
                    }
                    if (i.isExpanded()) {
                        var j = i.childNodes,
                            h = j.length;
                        for (var g = 0; g < h; g++) {
                            d(j[g])
                        }
                    }
                };
                d(c);
                this.totalCount = f.length;
                this.cachePage(f, 1);
                if (Ext.isNumber(this.eventsSuspended) || !e) {
                    this.resumeEvents()
                }
            }
        })
    },
    setupLockableTree: function () {
        var j;
        var g;
        var i = this;
        var k = i.store.buffered;
        var d = i.getView();
        var o = i.lockedGrid.getView();
        var e = i.normalGrid.getView();
        var l = e.store;
        var c = i.store;
        var h = i.normalGrid.verticalScroller;
        var m = function (t, s) {
            var q = c.viewSize || 50;
            var p = l.getTotalCount();
            if (p) {
                var r = s - t + 1;
                if (r < q && p >= r) {
                    s = t + q - 1
                }
                if (s >= p) {
                    t = p - (s - t);
                    s = p - 1;
                    t = Math.max(0, t)
                }
                l.guaranteeRange(t, s)
            }
        };
        this.mon(c, "root-fill-start", function () {
            g = true;
            l.suspendEvents();
            if (k) {
                j = l.node;
                l.setNode()
            }
        });
        this.mon(c, "root-fill-end", function () {
            g = false;
            if (k) {
                l.refreshFromTree();
                l.resumeEvents();
                m(0, c.viewSize || 50)
            } else {
                l.resumeEvents();
                d.refresh()
            }
        });
        if (k) {
            var n, a;
            this.mon(l, "guaranteedrange", function (q, r, p) {
                n = r;
                a = p
            });
            var f = function () {
                if (g) {
                    return
                }
                l.refreshFromTree();
                m(n || 0, a || 50);
                if (e.rendered) {
                    i.onNormalViewScroll()
                }
            };
            this.mon(c, {
                append: f,
                insert: f,
                remove: f,
                move: f,
                expand: f,
                collapse: f,
                sort: f,
                buffer: 1
            })
        }
        this.mon(c, "filter", function (q, p) {
            l.filter.apply(l, p);
            d.refresh()
        });
        this.mon(c, "clearfilter", function (p) {
            l.clearFilter();
            d.refresh()
        });
        this.mon(c, "beforecascade", function (p) {
            l.suspendEvents()
        });
        this.mon(c, "cascade", function (q, p) {
            l.resumeEvents();
            if (p.nbrAffected > 0) {
                e.refreshKeepingScroll(true);
                setTimeout(function () {
                    o.saveScrollState();
                    o.refresh();
                    o.restoreScrollState()
                }, 0)
            }
        });
        if (k && h) {
            var b = h.onGuaranteedRange;
            h.onGuaranteedRange = function () {
                b.apply(this, arguments);
                Ext.suspendLayouts();
                d.refresh();
                Ext.resumeLayouts()
            }
        }
    },
    onNormalViewItemUpdate: function (a, b, d) {
        if (this.lockedGridDependsOnSchedule) {
            var c = this.lockedGrid.getView();
            c.suspendEvents();
            c.onUpdate(this.lockedGrid.store, a);
            c.resumeEvents()
        }
        var f = this.normalGrid.getView().getNode(b);
        var e = f.style.height !== d.style.height;
        f.style.height = d.style.height;
        this.normalHeights[b] = d.style.height;
        this.syncRowHeights(e)
    },
    afterNormalGridItemExpand: function (a) {
        var c = this;
        var b = c.getSchedulingView();
        a.cascadeBy(function (f) {
            if (f !== a) {
                var e = b.getNode(f);
                if (e) {
                    var d = b.indexOf(e);
                    c.normalHeights[d] = e.style.height
                }
            }
        });
        c.syncRowHeights(true)
    },
    onViewItemAdd: function (c, d, b) {
        var e = this.normalGrid.getView();
        var f = this.lockedGrid.getView();
        if (e.getNodes().length !== f.getNodes().length) {
            return
        }
        var a = this.normalHeights;
        Ext.each(c, function (h, g) {
            var i = e.getNode(h);
            if (i) {
                a[i.viewIndex] = i.style.height
            }
        });
        this.syncRowHeights()
    },
    processColumns: function (b) {
        var a = this.callParent(arguments);
        var c = [];
        Ext.each(b, function (d) {
            if (d.position == "right") {
                d.processed = true;
                if (!Ext.isNumber(d.width)) {
                    Ext.Error.raise('"Right" columns must have a fixed width')
                }
                c.push(d);
                Ext.Array.remove(a.locked.items, d);
                a.lockedWidth -= d.width
            }
        });
        if (this.orientation === "horizontal") {
            a.normal.items = [{
                xtype: this.lightWeight ? "singletimeaxiscolumn" : "timeaxiscolumn",
                timeAxis: this.timeAxis,
                timeCellRenderer: this.timeCellRenderer,
                timeCellRendererScope: this.timeCellRendererScope,
                trackHeaderOver: this.trackHeaderOver
            }].concat(c)
        } else {
            a.locked.items = [Ext.apply({
                xtype: "verticaltimeaxis",
                width: 100,
                timeAxis: this.timeAxis
            }, this.timeAxisColumnCfg || {})];
            a.lockedWidth = a.locked.items[0].width
        }
        return a
    },
    prepareFullRowHeightSync: function () {
        var g = this,
            h = g.normalGrid.getView(),
            j = g.lockedGrid.getView();
        if (!h.rendered || !j.rendered) {
            return
        }
        var a = h.el,
            d = j.el,
            f = a.query(h.getItemSelector()),
            b = d.query(j.getItemSelector()),
            e = f.length,
            c = 0;
        g.lockedHeights = [];
        g.normalHeights = [];
        if (b.length !== e) {
            return
        }
        for (; c < e; c++) {
            g.normalHeights[c] = f[c].style.height
        }
    },
    onLockedViewRefresh: function () {
        this.prepareFullRowHeightSync();
        this.syncRowHeights()
    },
    onNormalViewRefresh: function () {
        var a = this.lockedGrid.getView();
        if (this.lockedGridDependsOnSchedule) {
            a.un("refresh", this.onLockedViewRefresh, this);
            this.lockedGrid.getView().refresh();
            a.on("refresh", this.onLockedViewRefresh, this)
        }
        this.prepareFullRowHeightSync();
        this.syncRowHeights()
    },
    syncRowHeights: function (b) {
        if (!this.lockedGrid.getView().rendered || !this.normalGrid.getView().rendered) {
            return
        }
        var j = this,
            c = j.lockedHeights,
            k = j.normalHeights,
            a = [],
            h = c.length || k.length,
            f = 0,
            l, d, e, g;
        if (c.length || k.length) {
            l = j.lockedGrid.getView();
            d = j.normalGrid.getView();
            e = l.el.query(l.getItemSelector());
            g = d.el.query(d.getItemSelector());
            if (g.length !== e.length) {
                return
            }
            for (; f < h; f++) {
                if (e[f] && k[f]) {
                    e[f].style.height = k[f]
                }
            }
            j.lockedHeights = [];
            j.normalHeights = []
        }
        if (b !== false) {
            j.updateSpacer()
        }
    },
    getMenuItems: function () {
        return function () {
            return Ext.grid.header.Container.prototype.getMenuItems.call(this)
        }
    },
    applyColumnsState: Ext.emptyFn,
    updateSpacer: function () {
        var g = this.lockedGrid.getView();
        var e = this.normalGrid.getView();
        if (g.rendered && e.rendered && g.el.child("table") && !this.getSchedulingView().__lightRefresh) {
            var f = this,
                c = g.el,
                d = e.el.dom,
                b = c.dom.id + "-spacer",
                h = (d.offsetHeight - d.clientHeight) + "px";
            f.spacerEl = Ext.getDom(b);
            if (f.spacerEl) {
                f.spacerEl.style.height = h
            } else {
                var a;
                if (this.store.buffered) {
                    a = f.normalGrid.verticalScroller.stretcher.item(0).dom.parentNode === c.dom ? f.normalGrid.verticalScroller.stretcher.item(0) : f.normalGrid.verticalScroller.stretcher.item(1)
                } else {
                    a = c
                }
                Ext.core.DomHelper.append(a, {
                    id: b,
                    cls: this.store.buffered ? "sch-locked-buffered-spacer" : "",
                    style: "height: " + h
                })
            }
        }
    },
    onLockedViewRender: function () {
        var d = this.normalGrid;
        if (!this.lockedStretcher) {
            var c = this.lockedGrid.getView().el;
            var a = this.lockedStretcher = c.createChild({
                cls: "x-stretcher",
                style: {
                    position: "absolute",
                    width: "1px",
                    height: 0,
                    top: 0,
                    left: 0
                }
            }, c.dom.firstChild)
        }
        if (!d.rendered) {
            d.getView().on("render", this.onLockedViewRender, this);
            return
        }
        d.getView().el.un("scroll", this.onNormalViewScroll, this);
        d.getView().el.on("scroll", this.onNormalViewScroll, this);
        var b = d.verticalScroller;
        b.stretcher.addCls("x-stretcher");
        b.stretcher = new Ext.dom.CompositeElement([this.lockedStretcher, b.stretcher])
    },
    onNormalViewGroupExpand: function () {
        this.prepareFullRowHeightSync();
        this.syncRowHeights()
    }
});
Ext.define("Sch.plugin.TreeCellEditing", {
    extend: "Ext.grid.plugin.CellEditing",
    init: function (a) {
        this._grid = a;
        this.on("beforeedit", this.checkReadOnly, this);
        this.callParent(arguments)
    },
    checkReadOnly: function () {
        var a = this._grid;
        if (!(a instanceof Sch.panel.TimelineTreePanel)) {
            a = a.up("tablepanel")
        }
        return !a.isReadOnly()
    },
    startEditByClick: function (c, a, h, b, g, d, f) {
        if (f.getTarget(c.expanderSelector)) {
            return
        }
        this.callParent(arguments)
    },
    startEdit: function (a, f) {
        if (!a || !f) {
            return
        }
        var d = this,
            b = d.getEditor(a, f),
            e = a.get(f.dataIndex),
            c = d.getEditingContext(a, f);
        a = c.record;
        f = c.column;
        d.completeEdit();
        if (f && !f.getEditor(a)) {
            return false
        }
        if (b) {
            c.originalValue = c.value = e;
            if (d.beforeEdit(c) === false || d.fireEvent("beforeedit", c) === false || c.cancel) {
                return false
            }
            d.context = c;
            d.setActiveEditor(b);
            d.setActiveRecord(a);
            d.setActiveColumn(f);
            d.grid.view.focusCell({
                column: c.colIdx,
                row: c.rowIdx
            });
            d.editTask.delay(15, b.startEdit, b, [d.getCell(a, f), c.value, c])
        } else {
            d.grid.getView().getEl(f).focus((Ext.isWebKit || Ext.isIE) ? 10 : false)
        }
    },
    getEditingContext: function (e, c) {
        var f = this,
            a = f.grid,
            i = a.store,
            b, d, g = a.getView(),
            h;
        if (Ext.isNumber(e)) {
            b = e;
            e = i.getAt(b)
        } else {
            if (i.indexOf) {
                b = i.indexOf(e)
            } else {
                b = g.indexOf(g.getNode(e))
            }
        }
        if (Ext.isNumber(c)) {
            d = c;
            c = a.headerCt.getHeaderAtIndex(d)
        } else {
            d = c.getIndex()
        }
        h = e.get(c.dataIndex);
        return {
            grid: a,
            record: e,
            field: c.dataIndex,
            value: h,
            row: g.getNode(b),
            column: c,
            rowIdx: b,
            colIdx: d
        }
    },
    startEditByPosition: function (a) {
        var f = this,
            d = f.grid,
            h = d.getSelectionModel(),
            b = f.view,
            e = this.view.getNode(a.row),
            g = d.headerCt.getHeaderAtIndex(a.column),
            c = b.getRecord(e);
        if (h.selectByPosition) {
            h.selectByPosition(a)
        }
        f.startEdit(c, g)
    },
    onEditComplete: function (c, g, b) {
        var f = this,
            d = f.grid,
            e = f.getActiveColumn(),
            h = d.getSelectionModel(),
            a;
        if (e) {
            a = f.context.record;
            f.setActiveEditor(null);
            f.setActiveColumn(null);
            f.setActiveRecord(null);
            if (!f.validateEdit()) {
                return
            }
            if (!f.context.doNotUpdateRecord && !a.isEqual(g, b)) {
                a.set(e.dataIndex, g)
            }
            if (h.setCurrentPosition) {
                h.setCurrentPosition(h.getCurrentPosition())
            }
            d.getView().getEl(e).focus();
            f.context.value = g;
            f.fireEvent("edit", f, f.context)
        }
    }
});
Ext.define("Sch.feature.ColumnLines", {
    extend: "Sch.plugin.Lines",
    cls: "sch-column-line",
    showTip: false,
    requires: ["Ext.data.Store"],
    init: function (b) {
        this.timeAxis = b.getTimeAxis();
        this.store = Ext.create("Ext.data.JsonStore", {
            model: Ext.define("Sch.model.TimeLine", {
                extend: "Ext.data.Model",
                fields: ["start", {
                    name: "Date",
                    convert: function (d, c) {
                        return c.data.start
                    }
                }]
            }),
            data: b.getOrientation() === "horizontal" ? this.getData() : []
        });
        this.callParent(arguments);
        var a = this.schedulerView;
        a.timeAxis.on("reconfigure", this.populate, this)
    },
    populate: function () {
        var a = this.schedulerView;
        var b = a.getOrientation() === "horizontal" && a.store.getCount() > 0;
        this.store.removeAll(b);
        if (b) {
            this.store.add(this.getData())
        }
    },
    getElementData: function () {
        var a = this.schedulerView;
        if (a.getOrientation() === "horizontal" && a.store.getCount() > 0) {
            return this.callParent(arguments)
        }
        return []
    },
    getData: function () {
        var a = [];
        this.timeAxis.forEachMainInterval(function (d, b, c) {
            if (c > 0) {
                a.push({
                    start: d
                })
            }
        });
        a.push({
            start: this.timeAxis.getEnd()
        });
        return a
    }
});
Ext.define("Sch.plugin.CurrentTimeLine", {
    extend: "Sch.plugin.Lines",
    tooltipText: "Current time",
    updateInterval: 60000,
    autoUpdate: true,
    init: function (c) {
        var b = Ext.create("Ext.data.JsonStore", {
            model: Ext.define("TimeLineEvent", {
                extend: "Ext.data.Model",
                fields: ["Date", "Cls", "Text"]
            }),
            data: [{
                Date: new Date(),
                Cls: "sch-todayLine",
                Text: this.tooltipText
            }]
        });
        var a = b.first();
        if (this.autoUpdate) {
            this.runner = Ext.create("Ext.util.TaskRunner");
            this.runner.start({
                run: function () {
                    a.set("Date", new Date())
                },
                interval: this.updateInterval
            })
        }
        c.on("destroy", this.onHostDestroy, this);
        this.store = b;
        this.callParent(arguments)
    },
    onHostDestroy: function () {
        if (this.runner) {
            this.runner.stopAll()
        }
        if (this.store.autoDestroy) {
            this.store.destroy()
        }
    }
});
Ext.define("Sch.mixin.TimelineView", {
    requires: ["Sch.column.Time", "Sch.data.TimeAxis"],
    orientation: "horizontal",
    overScheduledEventClass: "sch-event-hover",
    selectedEventCls: "sch-event-selected",
    altColCls: "sch-col-alt",
    timeCellCls: "sch-timetd",
    timeCellSelector: ".sch-timetd",
    ScheduleEventMap: {
        click: "Click",
        dblclick: "DblClick",
        contextmenu: "ContextMenu",
        keydown: "KeyDown"
    },
    suppressFitCheck: 0,
    forceFit: false,
    inheritables: function () {
        return {
            cellBorderWidth: 1,
            initComponent: function () {
                this.setOrientation(this.panel._top.orientation || this.orientation);
                this.addEvents("beforetooltipshow", "scheduleclick", "scheduledblclick", "schedulecontextmenu", "columnwidthchange");
                this.enableBubble("columnwidthchange");
                var a = {}, c = Sch.util.Date;
                a[c.DAY] = a[c.WEEK] = a[c.MONTH] = a[c.QUARTER] = a[c.YEAR] = null;
                Ext.applyIf(this, {
                    eventPrefix: this.id + "-",
                    largeUnits: a
                });
                this.callParent(arguments);
                if (this.orientation === "horizontal") {
                    this.getTimeAxisColumn().on("timeaxiscolumnreconfigured", this.checkHorizontalFit, this)
                }
                var b = this.panel._top;
                Ext.apply(this, {
                    eventRendererScope: b.eventRendererScope,
                    eventRenderer: b.eventRenderer,
                    eventBorderWidth: b.eventBorderWidth,
                    timeAxis: b.timeAxis,
                    dndValidatorFn: b.dndValidatorFn || Ext.emptyFn,
                    resizeValidatorFn: b.resizeValidatorFn || Ext.emptyFn,
                    createValidatorFn: b.createValidatorFn || Ext.emptyFn,
                    tooltipTpl: b.tooltipTpl,
                    validatorFnScope: b.validatorFnScope || this,
                    snapToIncrement: b.snapToIncrement,
                    timeCellRenderer: b.timeCellRenderer,
                    timeCellRendererScope: b.timeCellRendererScope,
                    readOnly: b.readOnly,
                    eventResizeHandles: b.eventResizeHandles,
                    enableEventDragDrop: b.enableEventDragDrop,
                    enableDragCreation: b.enableDragCreation,
                    dragConfig: b.dragConfig,
                    dropConfig: b.dropConfig,
                    resizeConfig: b.resizeConfig,
                    createConfig: b.createConfig,
                    tipCfg: b.tipCfg,
                    orientation: b.orientation,
                    getDateConstraints: b.getDateConstraints || Ext.emptyFn
                });
                if (this.emptyText) {
                    this.emptyText = '<span class="sch-empty-text">' + this.emptyText + "</span>"
                }
            },
            onDestroy: function () {
                if (this.tip) {
                    this.tip.destroy()
                }
                this.callParent(arguments)
            },
            afterComponentLayout: function () {
                this.callParent(arguments);
                var b = this.getWidth();
                var a = this.getHeight();
                if (b === this.__prevWidth && a === this.__prevHeight) {
                    return
                }
                this.__prevWidth = b;
                this.__prevHeight = a;
                if (!this.lockable && !this.suppressFitCheck) {
                    this.checkHorizontalFit()
                }
            },
            beforeRender: function () {
                this.callParent(arguments);
                this.addCls("sch-timelineview");
                if (this.readOnly) {
                    this.addCls(this._cmpCls + "-readonly")
                }
            },
            afterRender: function () {
                this.callParent(arguments);
                if (this.overScheduledEventClass) {
                    this.mon(this.el, {
                        mouseover: this.onMouseOver,
                        mouseout: this.onMouseOut,
                        delegate: this.eventSelector,
                        scope: this
                    })
                }
                if (this.tooltipTpl) {
                    this.el.on("mousemove", this.setupTooltip, this, {
                        single: true
                    })
                }
                this.setupTimeCellEvents()
            },
            processUIEvent: function (f) {
                var c = this,
                    a = f.getTarget(this.eventSelector),
                    d = c.ScheduleEventMap,
                    b = f.type;
                if (a && b in d) {
                    this.fireEvent(this.scheduledEventName + b, this, this.resolveEventRecord(a), f)
                } else {
                    this.callParent(arguments)
                }
            },
            refresh: function () {
                this.fixedNodes = 0;
                this.callParent(arguments)
            },
            clearViewEl: function () {
                var c = this,
                    b = c.getTargetEl();
                b.down("table").remove();
                if (this.emptyText) {
                    var a = b.down(".sch-empty-text");
                    if (a) {
                        a.remove()
                    }
                }
            },
            onMouseOver: function (b, a) {
                if (a !== this.lastItem) {
                    this.lastItem = a;
                    Ext.fly(a).addCls(this.overScheduledEventClass);
                    this.fireEvent("eventmouseenter", this, this.resolveEventRecord(a), b)
                }
            },
            onMouseOut: function (b, a) {
                if (this.lastItem) {
                    if (!b.within(this.lastItem, true, true)) {
                        Ext.fly(this.lastItem).removeCls(this.overScheduledEventClass);
                        this.fireEvent("eventmouseleave", this, this.resolveEventRecord(this.lastItem), b);
                        delete this.lastItem
                    }
                }
            },
            highlightItem: function (b) {
                if (b) {
                    var a = this;
                    a.clearHighlight();
                    a.highlightedItem = b;
                    Ext.fly(b).addCls(a.overItemCls)
                }
            },
            shouldUpdateCell: function () {
                return true
            }
        }
    },
    hasRightColumns: function () {
        return this.headerCt.items.getCount() > 1
    },
    checkHorizontalFit: function () {
        if (this.orientation === "horizontal") {
            var a = this.getActualTimeColumnWidth();
            var c = this.getFittingColumnWidth();
            if (this.forceFit) {
                if (c != a) {
                    this.fitColumns()
                }
            } else {
                if (this.snapToIncrement) {
                    var b = this.calculateTimeColumnWidth(a);
                    if (b > 0 && b !== a) {
                        this.setColumnWidth(b)
                    }
                } else {
                    if (a < c) {
                        this.fitColumns()
                    }
                }
            }
        }
    },
    getTimeAxisColumn: function () {
        return this.headerCt.items.get(0)
    },
    getFirstTimeColumn: function () {
        return this.headerCt.getGridColumns()[0]
    },
    getFormattedDate: function (a) {
        return Ext.Date.format(a, this.getDisplayDateFormat())
    },
    getFormattedEndDate: function (d, a) {
        var b = this.timeAxis,
            c = b.getResolution().unit;
        if (c in this.largeUnits && d.getHours() === 0 && d.getMinutes() === 0 && !(d.getYear() === a.getYear() && d.getMonth() === a.getMonth() && d.getDate() === a.getDate())) {
            d = Sch.util.Date.add(d, Sch.util.Date.DAY, - 1)
        }
        return Ext.Date.format(d, this.getDisplayDateFormat())
    },
    getDisplayDateFormat: function () {
        return this.displayDateFormat
    },
    setDisplayDateFormat: function (a) {
        this.displayDateFormat = a
    },
    getSingleUnitInPixels: function (a) {
        return Sch.util.Date.getUnitToBaseUnitRatio(this.timeAxis.getUnit(), a) * this.getSingleTickInPixels() / this.timeAxis.getIncrement()
    },
    getSingleTickInPixels: function () {
        throw "Must be implemented by horizontal/vertical"
    },
    scrollEventIntoView: function (c, a) {
        var b = this.getOuterElementFromEventRecord(c);
        if (b) {
            b.scrollIntoView(this.el);
            if (a) {
                if (typeof a === "boolean") {
                    b.highlight()
                } else {
                    b.highlight(null, a)
                }
            }
        }
    },
    calculateTimeColumnWidth: function (e) {
        if (!this.panel.rendered) {
            return e
        }
        var h = this.forceFit;
        var b = 0,
            d = this.timeAxis.getUnit(),
            k = this.timeAxis.getCount(),
            g = Number.MAX_VALUE;
        if (this.snapToIncrement) {
            var i = this.timeAxis.getResolution(),
                j = i.unit,
                c = i.increment;
            g = Sch.util.Date.getUnitToBaseUnitRatio(d, j) * c
        }
        var f = Sch.util.Date.getMeasuringUnit(d);
        g = Math.min(g, Sch.util.Date.getUnitToBaseUnitRatio(d, f));
        var a = Math.floor(this.getAvailableWidthForSchedule() / k);
        b = (h || e < a) ? a : e;
        if (g > 0 && (!h || g < 1)) {
            b = Math.round(Math.max(1, Math[h ? "floor" : "round"](g * b)) / g)
        }
        return b
    },
    getFittingColumnWidth: function () {
        var a = Math.floor(this.getAvailableWidthForSchedule() / this.timeAxis.getCount());
        return this.calculateTimeColumnWidth(a)
    },
    fitColumns: function (b) {
        var a = 0;
        if (this.orientation === "horizontal") {
            a = this.getFittingColumnWidth()
        } else {
            a = Math.floor((this.panel.getWidth() - Ext.getScrollbarSize().width - 1) / this.headerCt.getColumnCount())
        }
        this.setColumnWidth(a, b)
    },
    getAvailableWidthForSchedule: function () {
        var c = (this.lastBox && this.lastBox.width) || this.getWidth();
        var a = this.headerCt.items.items;
        for (var b = 1; b < a.length; b++) {
            c -= a[b].getWidth()
        }
        return c - Ext.getScrollbarSize().width - 1
    },
    getRightColumnsWidth: function () {
        var c = 0;
        var a = this.headerCt.items.items;
        for (var b = 1; b < a.length; b++) {
            c += a[b].getWidth()
        }
        return c
    },
    fixRightColumnsPositions: function () {
        var a = this.headerCt.items.items;
        var c = a[0].getWidth();
        for (var b = 1; b < a.length; b++) {
            var d = a[b];
            d.el.setLeft(c);
            c += d.getWidth()
        }
    },
    getElementFromEventRecord: function (a) {
        return Ext.get(this.eventPrefix + a.internalId)
    },
    getEventNodeByRecord: function (a) {
        return document.getElementById(this.eventPrefix + a.internalId)
    },
    getOuterElementFromEventRecord: function (a) {
        return Ext.get(this.eventPrefix + a.internalId)
    },
    resolveColumnIndex: function (a) {
        return Math.floor(a / this.getActualTimeColumnWidth())
    },
    getStartEndDatesFromRegion: function (b, a) {
        throw "Must be implemented by horizontal/vertical"
    },
    setupTooltip: function () {
        var b = this,
            a = Ext.apply({
                renderTo: Ext.getBody(),
                delegate: b.eventSelector,
                target: b.el,
                anchor: "b"
            }, b.tipCfg);
        b.tip = Ext.create("Ext.ToolTip", a);
        b.tip.on({
            beforeshow: function (d) {
                if (!d.triggerElement || !d.triggerElement.id) {
                    return false
                }
                var c = this.resolveEventRecord(d.triggerElement);
                if (!c || this.fireEvent("beforetooltipshow", this, c) === false) {
                    return false
                }
                d.update(this.tooltipTpl.apply(this.getDataForTooltipTpl(c)));
                return true
            },
            scope: this
        })
    },
    getDataForTooltipTpl: function (a) {
        return a.data
    },
    getTimeResolution: function () {
        return this.timeAxis.getResolution()
    },
    setTimeResolution: function (b, a) {
        this.timeAxis.setResolution(b, a);
        if (this.snapToIncrement) {
            this.refreshKeepingScroll()
        }
    },
    getEventIdFromDomNodeId: function (a) {
        return a.substring(this.eventPrefix.length)
    },
    getDateFromDomEvent: function (b, a) {
        return this.getDateFromXY(b.getXY(), a)
    },
    handleScheduleEvent: function (c) {
        var b = c.getTarget("." + this.timeCellCls, 2);
        if (b) {
            var a = this.getDateFromDomEvent(c, "floor");
            this.fireEvent("schedule" + c.type, this, a, this.indexOf(this.findItemByChild(b)), c)
        }
    },
    setupTimeCellEvents: function () {
        this.mon(this.el, {
            click: this.handleScheduleEvent,
            dblclick: this.handleScheduleEvent,
            contextmenu: this.handleScheduleEvent,
            scope: this
        }, this)
    },
    getSnapPixelAmount: function () {
        if (this.snapToIncrement) {
            var a = this.timeAxis.getResolution();
            return (a.increment || 1) * this.getSingleUnitInPixels(a.unit)
        } else {
            return 1
        }
    },
    getActualTimeColumnWidth: function () {
        return this.headerCt.items.get(0).getTimeColumnWidth()
    },
    setSnapEnabled: function (a) {
        this.snapToIncrement = a;
        if (a) {
            this.refreshKeepingScroll()
        }
    },
    setReadOnly: function (a) {
        this.readOnly = a;
        this[a ? "addCls" : "removeCls"](this._cmpCls + "-readonly")
    },
    isReadOnly: function () {
        return this.readOnly
    },
    setOrientation: function (a) {
        this.orientation = a;
        Ext.apply(this, Sch.view[Ext.String.capitalize(a)].prototype.props)
    },
    getOrientation: function () {
        return this.orientation
    },
    translateToScheduleCoordinate: function (a) {
        throw "Abstract method call!"
    },
    translateToPageCoordinate: function (a) {
        throw "Abstract method call!"
    },
    getDateFromXY: function (c, b, a) {
        throw "Abstract method call!"
    },
    getXYFromDate: function (a, b) {
        throw "Abstract method call!"
    },
    getTimeSpanRegion: function (a, b) {
        throw "Abstract method call!"
    },
    getStart: function () {
        return this.timeAxis.getStart()
    },
    getEnd: function () {
        return this.timeAxis.getEnd()
    },
    setBarMargin: function (b, a) {
        this.barMargin = b;
        if (!a) {
            this.refreshKeepingScroll()
        }
    },
    setRowHeight: function (a, b) {
        this.rowHeight = a || 24;
        if (this.rendered && !b) {
            this.refreshKeepingScroll()
        }
    },
    refreshKeepingScroll: function (a) {
        this.saveScrollState();
        if (this.lightRefresh) {
            this.lightRefresh()
        } else {
            this.refresh()
        }
        this.restoreScrollState()
    },
    refreshKeepingResourceScroll: function (c) {
        var d = this.el.dom,
            b = d.scrollTop,
            a = d.scrollLeft;
        if (this.lightRefresh) {
            this.lightRefresh()
        } else {
            this.refresh()
        }
        if (this.getOrientation() === "horizontal") {
            d.scrollTop = b
        } else {
            d.scrollLeft = a
        }
    },
    lightRefresh: function () {
        var a = this.refreshSize;
        Ext.suspendLayouts();
        this.refreshSize = Ext.emptyFn;
        this.__lightRefresh = true;
        this.refresh();
        delete this.__lightRefresh;
        this.refreshSize = a;
        Ext.resumeLayouts()
    }
});
Ext.apply(Sch, {
    VERSION: "2.1.7"
});
Ext.define("Sch.view.Horizontal", {
    props: {
        translateToScheduleCoordinate: function (a) {
            return a - this.el.getX() + this.el.getScroll().left
        },
        translateToPageCoordinate: function (a) {
            return a + this.el.getX() - this.el.getScroll().left
        },
        getDateFromXY: function (h, f, e) {
            var b, a = e ? h[0] : this.translateToScheduleCoordinate(h[0]),
                d = a / this.getActualTimeColumnWidth(),
                c = this.timeAxis.getCount();
            if (d < 0 || d > c) {
                b = null
            } else {
                var g = d - this.resolveColumnIndex(a);
                if (g > 2 && d >= c) {
                    return null
                }
                b = this.timeAxis.getDateFromTick(d, f)
            }
            return b
        },
        getXYFromDate: function (b, d) {
            var a, c = this.timeAxis.getTickFromDate(b);
            if (c >= 0) {
                a = this.getActualTimeColumnWidth() * c
            }
            if (d === false) {
                a = this.translateToPageCoordinate(a)
            }
            return [a, 0]
        },
        getEventBox: function (e, b) {
            var a = Math.floor(this.getXYFromDate(e)[0]),
                c = Math.floor(this.getXYFromDate(b)[0]),
                d = Math;
            if (this.managedEventSizing) {
                return {
                    top: Math.max(0, (this.barMargin - (Ext.isIE && !Ext.isStrict) ? 0 : this.eventBorderWidth - this.cellBorderWidth)),
                    left: d.min(a, c),
                    width: d.max(1, d.abs(a - c) - this.eventBorderWidth),
                    height: this.rowHeight - (2 * this.barMargin) - this.eventBorderWidth
                }
            }
            return {
                left: d.min(a, c),
                width: d.max(1, d.abs(a - c))
            }
        },
        layoutEvents: function (a) {
            var c = Ext.Array.clone(a);
            c.sort(this.sortEvents);
            var b = this.layoutEventsInBands(0, c);
            return b
        },
        layoutEventsInBands: function (d, a) {
            var c = a[0],
                b = d === 0 ? this.barMargin : (d * this.rowHeight - ((d - 1) * this.barMargin));
            if (b >= this.cellBorderWidth) {
                b -= this.cellBorderWidth
            }
            while (c) {
                c.top = b;
                Ext.Array.remove(a, c);
                c = this.findClosestSuccessor(c, a)
            }
            d++;
            if (a.length > 0) {
                return this.layoutEventsInBands(d, a)
            } else {
                return d
            }
        },
        getScheduleRegion: function (d, f) {
            var h = d ? Ext.fly(this.getNodeByRecord(d)).getRegion() : this.el.down(".x-grid-table").getRegion(),
                e = this.timeAxis.getStart(),
                j = this.timeAxis.getEnd(),
                b = this.getDateConstraints(d, f) || {
                    start: e,
                    end: j
                }, c = this.translateToPageCoordinate(this.getXYFromDate(b.start)[0]),
                i = this.translateToPageCoordinate(this.getXYFromDate(b.end)[0]) - this.eventBorderWidth,
                g = h.top + this.barMargin,
                a = h.bottom - this.barMargin - this.eventBorderWidth;
            return new Ext.util.Region(g, Math.max(c, i), a, Math.min(c, i))
        },
        getResourceRegion: function (h, d, g) {
            var k = Ext.fly(this.getNodeByRecord(h)).getRegion(),
                i = this.timeAxis.getStart(),
                n = this.timeAxis.getEnd(),
                c = d ? Sch.util.Date.max(i, d) : i,
                e = g ? Sch.util.Date.min(n, g) : n,
                f = this.getXYFromDate(c)[0],
                m = this.getXYFromDate(e)[0] - this.eventBorderWidth,
                l = this.el.getTop(),
                b = this.el.getScroll(),
                j = k.top + 1 - l + b.top,
                a = k.bottom - 1 - l + b.top;
            return new Ext.util.Region(j, Math.max(f, m), a, Math.min(f, m))
        },
        collectRowData: function (g, p, o) {
            var c = this.eventStore.getEventsForResource(p);
            if (c.length === 0 || this.headerCt.getColumnCount() === 0) {
                g.rowHeight = this.rowHeight;
                return g
            }
            var a = Sch.util.Date,
                m = this.timeAxis,
                n = m.getStart(),
                r = m.getEnd(),
                k = [],
                j, f;
            for (j = 0, f = c.length; j < f; j++) {
                var b = c[j],
                    d = b.getStartDate(),
                    h = b.getEndDate();
                if (d && h && m.timeSpanInAxis(d, h)) {
                    var q = this.generateTplData(b, n, r, p, o);
                    k[k.length] = q
                }
            }
            var e = 1;
            if (this.dynamicRowHeight) {
                e = this.layoutEvents(k)
            }
            g.rowHeight = (e * this.rowHeight) - ((e - 1) * this.barMargin);
            g[this.getFirstTimeColumn().id] += "&#160;" + this.eventTpl.apply(k);
            return g
        },
        resolveResource: function (a) {
            var b = this.findItemByChild(a);
            if (b) {
                return this.getRecord(b)
            }
            return null
        },
        getTimeSpanRegion: function (b, h, g) {
            var d = this.getXYFromDate(b)[0],
                f = this.getXYFromDate(h || b)[0],
                a, c;
            if (this.store.buffered) {
                var e;
                if (this.panel.verticalScroller.stretcher instanceof Ext.CompositeElement) {
                    e = this.panel.verticalScroller.stretcher.first()
                } else {
                    e = this.el.down(".x-stretcher")
                }
                if (e.dom.clientHeight) {
                    c = e
                }
            }
            if (!c) {
                c = this.el.down(".x-grid-table")
            }
            if (g) {
                a = Math.max(c ? c.dom.clientHeight : 0, this.el.dom.clientHeight)
            } else {
                a = c ? c.dom.clientHeight : 0
            }
            return new Ext.util.Region(0, Math.max(d, f), a, Math.min(d, f))
        },
        getStartEndDatesFromRegion: function (c, b) {
            var a = this.getDateFromXY([c.left, 0], b),
                d = this.getDateFromXY([c.right, 0], b);
            if (d && a) {
                return {
                    start: Sch.util.Date.min(a, d),
                    end: Sch.util.Date.max(a, d)
                }
            } else {
                return null
            }
        },
        onEventAdd: function (c, e) {
            var f = {};
            for (var b = 0, a = e.length; b < a; b++) {
                var d = e[b].getResource();
                if (d) {
                    f[d.getId()] = d
                }
            }
            Ext.Object.each(f, function (h, g) {
                this.onUpdate(this.resourceStore, g)
            }, this)
        },
        onEventRemove: function (c, a) {
            var b = this.getElementFromEventRecord(a);
            if (b) {
                var d = this.resolveResource(b);
                b.fadeOut({
                    callback: function () {
                        if (Ext.tree.View && this instanceof Ext.tree.View && this.store.indexOf(d)) {
                            this.onUpdate(this.store, d)
                        } else {
                            if (this.resourceStore.indexOf(d) >= 0) {
                                this.onUpdate(this.resourceStore, d)
                            }
                        }
                    },
                    scope: this
                })
            }
        },
        onEventUpdate: function (b, c, a) {
            var e, d = c.previous;
            if (d && d[c.resourceIdField]) {
                e = c.getResource(d[c.resourceIdField]);
                if (e) {
                    this.onUpdate(this.resourceStore, e)
                }
            }
            e = c.getResource();
            if (e) {
                this.onUpdate(this.resourceStore, e)
            }
        },
        getSingleTickInPixels: function () {
            return this.getActualTimeColumnWidth()
        },
        getColumnWidth: function () {
            if (this.getTimeAxisColumn()) {
                return this.getTimeAxisColumn().getTimeColumnWidth()
            }
        },
        setColumnWidth: function (b, a) {
            if (this.getTimeAxisColumn()) {
                this.getTimeAxisColumn().setTimeColumnWidth(b);
                if (!a) {
                    this.refreshKeepingScroll()
                }
            }
            this.fireEvent("columnwidthchange", this, b)
        },
        getVisibleDateRange: function () {
            if (!this.rendered) {
                return null
            }
            var c = this.getEl().getScroll(),
                b = this.panel.getStart(),
                f = this.panel.getEnd(),
                e = this.getWidth(),
                d = this.getEl().down(".x-grid-table").dom,
                a = d.clientWidth;
            if (a < e) {
                return {
                    startDate: b,
                    endDate: f
                }
            }
            return {
                startDate: this.getDateFromXY([c.left, 0], null, true),
                endDate: this.getDateFromXY([Math.min(c.left + e, a), 0], null, true)
            }
        }
    }
});
Ext.define("Sch.view.TimelineTreeView", {
    extend: "Ext.tree.View",
    mixins: ["Sch.mixin.TimelineView"],
    requires: ["Sch.patches.TreeView"],
    cellBorderWidth: 0,
    beforeRender: function () {
        this.addCls("sch-timelinetreeview");
        this.callParent(arguments)
    }
}, function () {
    this.override(Sch.mixin.TimelineView.prototype.inheritables() || {})
});
Ext.define("Sch.mixin.Zoomable", {
    zoomLevels: [{
        width: 200,
        increment: 1,
        resolution: 1,
        preset: "year"
    }, {
        width: 100,
        increment: 1,
        resolution: 7,
        preset: "monthAndYear"
    }, {
        width: 30,
        increment: 1,
        resolution: 1,
        preset: "weekDateAndMonth"
    }, {
        width: 35,
        increment: 1,
        resolution: 1,
        preset: "weekAndMonth"
    }, {
        width: 50,
        increment: 1,
        resolution: 1,
        preset: "weekAndMonth"
    }, {
        width: 85,
        increment: 1,
        resolution: 1,
        preset: "weekAndMonth"
    }, {
        width: 50,
        increment: 1,
        resolution: 1,
        preset: "weekAndDay",
        resolutionUnit: "HOUR"
    }, {
        width: 100,
        increment: 1,
        resolution: 1,
        preset: "weekAndDay",
        resolutionUnit: "HOUR"
    }, {
        width: 50,
        increment: 6,
        resolution: 30,
        preset: "hourAndDay",
        resolutionUnit: "MINUTE"
    }, {
        width: 100,
        increment: 6,
        resolution: 30,
        preset: "hourAndDay",
        resolutionUnit: "MINUTE"
    }, {
        width: 60,
        increment: 2,
        resolution: 30,
        preset: "hourAndDay",
        resolutionUnit: "MINUTE"
    }, {
        width: 60,
        increment: 1,
        resolution: 30,
        preset: "hourAndDay",
        resolutionUnit: "MINUTE"
    }, {
        width: 30,
        increment: 15,
        resolution: 5,
        preset: "minuteAndHour"
    }, {
        width: 60,
        increment: 15,
        resolution: 5,
        preset: "minuteAndHour"
    }, {
        width: 130,
        increment: 15,
        resolution: 5,
        preset: "minuteAndHour"
    }, {
        width: 60,
        increment: 5,
        resolution: 5,
        preset: "minuteAndHour"
    }, {
        width: 100,
        increment: 5,
        resolution: 5,
        preset: "minuteAndHour"
    }],
    minZoomLevel: null,
    maxZoomLevel: null,
    visibleZoomFactor: 5,
    cachedCenterDate: null,
    isFirstZoom: true,
    isZooming: false,
    initializeZooming: function () {
        this.zoomLevels = this.zoomLevels.slice();
        this.setMinZoomLevel(this.minZoomLevel || 0);
        this.setMaxZoomLevel(this.maxZoomLevel !== null ? this.maxZoomLevel : this.zoomLevels.length - 1);
        this.on("viewchange", this.clearCenterDateCache, this)
    },
    getZoomLevelUnit: function (b) {
        var a = Sch.preset.Manager.getPreset(b.preset).headerConfig;
        return a.bottom ? a.bottom.unit : a.middle.unit
    },
    getMilliSecondsPerPixelForZoomLevel: function (b) {
        var a = Sch.util.Date;
        return Math.round((a.add(new Date(1, 0, 1), this.getZoomLevelUnit(b), b.increment) - new Date(1, 0, 1)) / b.width)
    },
    presetToZoomLevel: function (e) {
        var d = Sch.preset.Manager.getPreset(e);
        var c = d.headerConfig;
        var a = c.bottom;
        var b = c.middle;
        return {
            preset: e,
            increment: (a ? a.increment : b.increment) || 1,
            resolution: d.timeResolution.increment,
            resolutionUnit: d.timeResolution.unit,
            width: d.timeColumnWidth
        }
    },
    calculateCurrentZoomLevel: function () {
        var d = this.presetToZoomLevel(this.viewPreset);
        var c = this.timeAxis.headerConfig;
        var a = c.bottom;
        var b = c.middle;
        d.width = this.timeAxis.preset.timeColumnWidth;
        d.increment = (a ? a.increment : b.increment) || 1;
        return d
    },
    getCurrentZoomLevelIndex: function () {
        var f = this.calculateCurrentZoomLevel();
        var b = this.getMilliSecondsPerPixelForZoomLevel(f);
        var e = this.zoomLevels;
        for (var c = 0; c < e.length; c++) {
            var d = this.getMilliSecondsPerPixelForZoomLevel(e[c]);
            if (d == b) {
                return c
            }
            if (c === 0 && b > d) {
                return -0.5
            }
            if (c == e.length - 1 && b < d) {
                return e.length - 1 + 0.5
            }
            var a = this.getMilliSecondsPerPixelForZoomLevel(e[c + 1]);
            if (d > b && b > a) {
                return c + 0.5
            }
        }
        throw "Can't find current zoom level index"
    },
    setMaxZoomLevel: function (a) {
        if (a < 0 || a >= this.zoomLevels.length) {
            throw new Error("Invalid range for `setMinZoomLevel`")
        }
        this.maxZoomLevel = a
    },
    setMinZoomLevel: function (a) {
        if (a < 0 || a >= this.zoomLevels.length) {
            throw new Error("Invalid range for `setMinZoomLevel`")
        }
        this.minZoomLevel = a
    },
    getViewportCenterDateCached: function () {
        if (this.cachedCenterDate) {
            return this.cachedCenterDate
        }
        return this.cachedCenterDate = this.getViewportCenterDate()
    },
    clearCenterDateCache: function () {
        this.cachedCenterDate = null
    },
    zoomToLevel: function (b) {
        b = Ext.Number.constrain(b, this.minZoomLevel, this.maxZoomLevel);
        var n = this.calculateCurrentZoomLevel();
        var d = this.getMilliSecondsPerPixelForZoomLevel(n);
        var i = this.zoomLevels[b];
        var a = this.getMilliSecondsPerPixelForZoomLevel(i);
        if (d == a) {
            return null
        }
        var p = this;
        var j = this.getSchedulingView();
        var f = j.getEl();
        if (this.isFirstZoom) {
            this.isFirstZoom = false;
            f.on("scroll", this.clearCenterDateCache, this)
        }
        var h = this.orientation == "vertical";
        var e = this.getViewportCenterDateCached();
        var k = h ? f.getHeight() : f.getWidth();
        var l = Ext.clone(Sch.preset.Manager.getPreset(i.preset));
        var o = this.calculateOptimalDateRange(e, k, i);
        var c = l.headerConfig;
        var g = c.bottom;
        var r = c.middle;
        l[h ? "rowHeight" : "timeColumnWidth"] = i.width;
        if (g) {
            g.increment = i.increment
        } else {
            r.increment = i.increment
        }
        this.isZooming = true;
        this.viewPreset = i.preset;
        var m = g ? g.unit : r.unit;
        this.timeAxis.reconfigure({
            preset: l,
            headerConfig: c,
            unit: m,
            increment: i.increment,
            resolutionUnit: Sch.util.Date.getUnitByName(i.resolutionUnit || m),
            resolutionIncrement: i.resolution,
            weekStartDay: this.weekStartDay,
            mainUnit: r.unit,
            shiftUnit: l.shiftUnit,
            shiftIncrement: l.shiftIncrement || 1,
            defaultSpan: l.defaultSpan || 1,
            start: o.startDate || this.getStart(),
            end: o.endDate || this.getEnd()
        });
        var q = j.getXYFromDate(e, true);
        f.on("scroll", function () {
            p.cachedCenterDate = e
        }, this, {
            single: true
        });
        if (h) {
            f.scrollTo("top", q[1] - k / 2)
        } else {
            f.scrollTo("left", q[0] - k / 2)
        }
        p.isZooming = false;
        this.fireEvent("zoomchange", this, b);
        return b
    },
    zoomIn: function (a) {
        a = a || 1;
        var b = this.getCurrentZoomLevelIndex();
        if (b >= this.zoomLevels.length - 1) {
            return null
        }
        return this.zoomToLevel(Math.floor(b) + a)
    },
    zoomOut: function (a) {
        a = a || 1;
        var b = this.getCurrentZoomLevelIndex();
        if (b <= 0) {
            return null
        }
        return this.zoomToLevel(Math.ceil(b) - a)
    },
    zoomInFull: function () {
        return this.zoomToLevel(this.maxZoomLevel)
    },
    zoomOutFull: function () {
        return this.zoomToLevel(this.minZoomLevel)
    },
    calculateOptimalDateRange: function (c, h, e) {
        var b = Sch.util.Date;
        var i = Sch.preset.Manager.getPreset(e.preset).headerConfig;
        var f = i.top ? i.top.unit : i.middle.unit;
        var j = this.getZoomLevelUnit(e);
        var d = Math.ceil(h / e.width * e.increment * this.visibleZoomFactor / 2);
        var a = b.add(c, j, - d);
        var g = b.add(c, j, d);
        return {
            startDate: this.timeAxis.floorDate(a, false, f),
            endDate: this.timeAxis.ceilDate(g, false, f)
        }
    }
});
Ext.define("Sch.mixin.TimelinePanel", {
    requires: ["Sch.util.Patch", "Sch.patches.LoadMask", "Sch.patches.Model", "Sch.patches.Table", "Sch.data.TimeAxis", "Sch.feature.ColumnLines", "Sch.view.Locking", "Sch.mixin.Lockable", "Sch.preset.Manager"],
    mixins: ["Sch.mixin.Zoomable"],
    orientation: "horizontal",
    weekStartDay: 1,
    snapToIncrement: false,
    readOnly: false,
    eventResizeHandles: "both",
    viewPreset: "weekAndDay",
    trackHeaderOver: true,
    startDate: null,
    endDate: null,
    eventBorderWidth: 1,
    syncCellHeight: Ext.emptyFn,
    tooltipTpl: null,
    tipCfg: {
        cls: "sch-tip",
        showDelay: 1000,
        hideDelay: 0,
        autoHide: true,
        anchor: "b"
    },
    lightWeight: true,
    timeCellRenderer: null,
    timeCellRendererScope: null,
    inheritables: function () {
        return {
            columnLines: true,
            enableColumnMove: false,
            enableLocking: true,
            lockable: true,
            lockedXType: null,
            normalXType: null,
            initComponent: function () {
                this.lightWeight = this.lightWeight && !this.timeCellRenderer;
                this.addEvents("timeheaderdblclick", "beforeviewchange", "viewchange");
                if (!this.timeAxis) {
                    this.timeAxis = Ext.create("Sch.data.TimeAxis")
                }
                if (!this.columns && !this.colModel) {
                    this.columns = []
                }
                this.timeAxis.on("reconfigure", this.onTimeAxisReconfigure, this);
                if (this.enableLocking) {
                    this.self.mixin("lockable", Sch.mixin.Lockable);
                    var b = 0,
                        a = this.columns.length,
                        c;
                    for (; b < a; ++b) {
                        c = this.columns[b];
                        if (c.locked !== false) {
                            c.locked = true
                        }
                    }
                    this.switchViewPreset(this.viewPreset, this.startDate, this.endDate, true)
                }
                this.callParent(arguments);
                if (this.lockable) {
                    this.applyViewSettings(this.timeAxis.preset);
                    if (!this.viewPreset) {
                        throw "You must define a valid view preset object. See Sch.preset.Manager class for reference"
                    }
                    if (this.lightWeight && this.columnLines) {
                        this.columnLinesFeature = new Sch.feature.ColumnLines();
                        this.columnLinesFeature.init(this)
                    }
                }
                this.initializeZooming();
                this.relayEvents(this.getView(), ["beforetooltipshow", "scheduleclick", "scheduledblclick", "schedulecontextmenu"])
            },
            getState: function () {
                var a = this,
                    b = a.callParent(arguments);
                Ext.apply(b, {
                    viewPreset: a.viewPreset,
                    startDate: a.getStart(),
                    endDate: a.getEnd(),
                    zoomMinLevel: a.zoomMinLevel,
                    zoomMaxLevel: a.zoomMaxLevel,
                    currentZoomLevel: a.currentZoomLevel
                });
                return b
            },
            getOrientation: function () {
                return this.orientation
            },
            applyState: function (b) {
                var a = this;
                a.callParent(arguments);
                if (b && b.viewPreset) {
                    a.switchViewPreset(b.viewPreset, b.startDate, b.endDate)
                }
                if (b && b.currentZoomLevel) {
                    a.zoomToLevel(b.currentZoomLevel)
                }
            },
            beforeRender: function () {
                this.callParent(arguments);
                if (this.lockable) {
                    this.addCls("sch-" + this.orientation)
                }
            },
            afterRender: function () {
                this.callParent(arguments);
                if (this.lockable) {
                    this.lockedGrid.on("itemdblclick", function (d, c, e, g, f) {
                        if (this.orientation == "vertical" && c) {
                            this.fireEvent("timeheaderdblclick", this, c.get("start"), c.get("end"), g, f)
                        }
                    }, this)
                } else {
                    var b = this.headerCt;
                    if (b && b.reorderer && b.reorderer.dropZone) {
                        var a = b.reorderer.dropZone;
                        a.positionIndicator = Ext.Function.createSequence(a.positionIndicator, function () {
                            this.valid = false
                        })
                    }
                }
            },
            delayScroll: function () {
                var a = this.getScrollTarget().el;
                if (a) {
                    this.scrollTask.delay(10, function () {
                        if (a.dom) {
                            this.syncHorizontalScroll(a.dom.scrollLeft)
                        }
                    }, this)
                }
            }
        }
    },
    setReadOnly: function (a) {
        this.getSchedulingView().setReadOnly(a)
    },
    isReadOnly: function () {
        return this.getSchedulingView().isReadOnly()
    },
    switchViewPreset: function (d, a, f, b) {
        if (this.fireEvent("beforeviewchange", this, d, a, f) !== false) {
            if (Ext.isString(d)) {
                this.viewPreset = d;
                d = Sch.preset.Manager.getPreset(d)
            }
            if (!d) {
                throw "View preset not found"
            }
            var e = d.headerConfig;
            var c = {
                unit: e.bottom ? e.bottom.unit : e.middle.unit,
                increment: (e.bottom ? e.bottom.increment : e.middle.increment) || 1,
                resolutionUnit: d.timeResolution.unit,
                resolutionIncrement: d.timeResolution.increment,
                weekStartDay: this.weekStartDay,
                mainUnit: e.middle.unit,
                shiftUnit: d.shiftUnit,
                headerConfig: d.headerConfig,
                shiftIncrement: d.shiftIncrement || 1,
                preset: d,
                defaultSpan: d.defaultSpan || 1
            };
            if (b) {
                c.start = a || new Date();
                c.end = f
            } else {
                c.start = a || this.timeAxis.getStart();
                c.end = f
            }
            if (!b) {
                this.applyViewSettings(d)
            }
            this.timeAxis.reconfigure(c)
        }
    },
    applyViewSettings: function (b) {
        var a = this.getSchedulingView();
        a.setDisplayDateFormat(b.displayDateFormat);
        if (this.orientation === "horizontal") {
            a.setRowHeight(this.rowHeight || b.rowHeight, true)
        }
    },
    getStart: function () {
        return this.timeAxis.getStart()
    },
    getEnd: function () {
        return this.timeAxis.getEnd()
    },
    getViewportCenterDate: function () {
        var b = this.getSchedulingView(),
            c = b.getEl(),
            a = c.getScroll(),
            d;
        if (this.orientation === "vertical") {
            d = [0, a.top + c.getHeight() / 2]
        } else {
            d = [a.left + c.getWidth() / 2, 0]
        }
        return b.getDateFromXY(d, null, true)
    },
    setTimeColumnWidth: function (b, a) {
        this.getSchedulingView().setColumnWidth(b, a)
    },
    onTimeAxisReconfigure: function () {
        this.fireEvent("viewchange", this);
        if (this.stateful && this.lockedGrid) {
            this.saveState()
        }
    },
    getColumnsState: function () {
        var b = this,
            a = b.lockedGrid.headerCt.getColumnsState();
        return a
    },
    shiftNext: function (a) {
        this.timeAxis.shiftNext(a)
    },
    shiftPrevious: function (a) {
        this.timeAxis.shiftPrevious(a)
    },
    goToNow: function () {
        this.setTimeSpan(new Date())
    },
    setTimeSpan: function (b, a) {
        if (this.timeAxis) {
            this.timeAxis.setTimeSpan(b, a)
        }
    },
    setStart: function (a) {
        this.setTimeSpan(a)
    },
    setEnd: function (a) {
        this.setTimeSpan(null, a)
    },
    getTimeAxis: function () {
        return this.timeAxis
    },
    getResourceByEventRecord: function (a) {
        return a.getResource()
    },
    scrollToDate: function (c, b) {
        var a = this.getSchedulingView(),
            d = a.getXYFromDate(c, true);
        if (this.orientation == "horizontal") {
            a.getEl().scrollTo("left", Math.max(0, d[0]), b)
        } else {
            a.getEl().scrollTo("top", Math.max(0, d[1]), b)
        }
    },
    getSchedulingView: function () {
        return this.lockable ? this.normalGrid.getView() : this.getView()
    },
    setOrientation: function (a) {
        this.removeCls("sch-" + this.orientation);
        this.addCls("sch-" + a);
        this.orientation = a
    }
});
Ext.define("Sch.panel.TimelineTreePanel", {
    extend: "Ext.tree.Panel",
    requires: ["Ext.data.TreeStore"],
    mixins: ["Sch.mixin.TimelinePanel"],
    useArrows: true,
    rootVisible: false,
    constructor: function (a) {
        a = a || {};
        a.animate = false;
        this.callParent(arguments)
    },
    initComponent: function () {
        this.callParent(arguments);
        if (this.lockable && this.lockedGrid.headerCt.query("treecolumn").length === 0) {
            Ext.Error.raise("You must define an Ext.tree.Column (or use xtype : 'treecolumn').")
        }
    },
    onRootChange: function (a) {
        if (!this.lockable) {
            this.callParent(arguments)
        }
    }
}, function () {
    this.override(Sch.mixin.TimelinePanel.prototype.inheritables() || {})
});
Ext.define("Sch.plugin.Printable", {
    extend: "Ext.AbstractPlugin",
    lockableScope: "top",
    docType: "<!DOCTYPE HTML>",
    beforePrint: Ext.emptyFn,
    afterPrint: Ext.emptyFn,
    autoPrintAndClose: true,
    fakeBackgroundColor: true,
    scheduler: null,
    constructor: function (a) {
        Ext.apply(this, a)
    },
    init: function (a) {
        this.scheduler = a;
        a.print = Ext.Function.bind(this.print, this)
    },
    mainTpl: '{docType}<html class="x-border-box {htmlClasses}"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type" /><title>{title}</title>{styles}</head><body class="sch-print-body {bodyClasses}"><div class="sch-print-ct {componentClasses}" style="width:{totalWidth}px"><div class="sch-print-headerbg" style="border-left-width:{totalWidth}px;height:{headerHeight}px;"></div><div class="sch-print-header-wrap"><div style="left:-{lockedScroll}px;margin-right:-{lockedScroll}px;width:{[values.lockedWidth + values.lockedScroll]}px" class="sch-print-lockedheader x-grid-header-ct x-grid-header-ct-default x-docked x-docked-top x-grid-header-ct-docked-top x-grid-header-ct-default-docked-top x-box-layout-ct x-docked-noborder-top x-docked-noborder-right x-docked-noborder-left">{lockedHeader}</div><div style="left:{lockedWidth}px;width:{normalWidth}px;" class="sch-print-normalheader x-grid-header-ct x-grid-header-ct-default x-docked x-docked-top x-grid-header-ct-docked-top x-grid-header-ct-default-docked-top x-box-layout-ct x-docked-noborder-top x-docked-noborder-right x-docked-noborder-left"><div style="margin-left:-{normalScroll}px">{normalHeader}</div></div></div><div id="lockedRowsCt" style="left:-{lockedScroll}px;margin-right:-{lockedScroll}px;width:{[values.lockedWidth + values.lockedScroll]}px;top:{headerHeight}px;" class="sch-print-locked-rows-ct {innerLockedClasses} x-grid-inner-locked">{lockedRows}</div><div id="normalRowsCt" style="left:{lockedWidth}px;top:{headerHeight}px;width:{normalWidth}px" class="sch-print-normal-rows-ct {innerNormalClasses}"><div style="position:relative;overflow:visible;margin-left:-{normalScroll}px">{normalRows}</div></div></div><script type="text/javascript">{setupScript}<\/script></body></html>',
    getGridContent: function (l) {
        var k = l.normalGrid,
            c = l.lockedGrid,
            m = c.getView(),
            d = k.getView(),
            f, b, j, e, i;
        this.beforePrint(l);
        var a = m.store.getRange();
        b = m.tpl.apply(m.collectData(a, 0));
        j = d.tpl.apply(d.collectData(a, 0));
        e = m.el.getScroll().left;
        i = d.el.getScroll().left;
        if (l.columnLinesFeature) {
            var h = l.columnLinesFeature;
            var g = h.containerEl;
            h.containerEl = Ext.get(document.createElement("div"));
            h.renderElementsInternal();
            j = h.containerEl.dom.innerHTML + j;
            h.containerEl = g
        }
        this.afterPrint(l);
        return {
            normalHeader: k.headerCt.el.dom.innerHTML,
            lockedHeader: c.headerCt.el.dom.innerHTML,
            lockedRows: b,
            normalRows: j,
            lockedScroll: e,
            normalScroll: i,
            lockedWidth: c.getWidth(),
            normalWidth: k.getWidth(),
            headerHeight: k.headerCt.getHeight(),
            innerLockedClasses: c.view.el.dom.className,
            innerNormalClasses: k.view.el.dom.className + (this.fakeBackgroundColor ? " sch-print-fake-background" : ""),
            width: l.getWidth()
        }
    },
    getStylesheets: function () {
        return Ext.getDoc().select('link[rel="stylesheet"]')
    },
    print: function () {
        var g = this.scheduler;
        if (!(this.mainTpl instanceof Ext.Template)) {
            var a = 22;
            this.mainTpl = Ext.create("Ext.XTemplate", this.mainTpl, {
                compiled: true,
                disableFormats: true
            })
        }
        var h = g.getView(),
            i = this.getStylesheets(),
            e = Ext.get(Ext.core.DomHelper.createDom({
                tag: "div"
            })),
            b;
        i.each(function (j) {
            e.appendChild(j.dom.cloneNode(true))
        });
        b = e.dom.innerHTML + "";
        var f = this.getGridContent(g),
            c = this.mainTpl.apply(Ext.apply({
                waitText: this.waitText,
                docType: this.docType,
                htmlClasses: "",
                bodyClasses: Ext.getBody().dom.className,
                componentClasses: g.el.dom.className,
                title: (g.title || ""),
                styles: b,
                totalWidth: g.getWidth(),
                setupScript: "(" + this.setupScript.toString() + ")();"
            }, f));
        var d = window.open("", "printgrid");
        d.document.write(c);
        d.document.close();
        if (this.autoPrintAndClose) {
            d.print();
            if (!Ext.isChrome) {
                d.close()
            }
        }
    },
    setupScript: function () {
        var f = document.getElementById("lockedRowsCt"),
            d = document.getElementById("normalRowsCt"),
            b = f.getElementsByTagName("tr"),
            a = d.getElementsByTagName("tr"),
            e = a.length,
            c = 0;
        for (; c < e; c++) {
            b[c].style.height = a[c].style.height
        }
    }
});
Ext.define("Sch.plugin.PdfExport", {
    extend: "Ext.util.Observable",
    mixins: ["Ext.AbstractPlugin"],
    lockableScope: "top",
    printServer: undefined,
    tpl: new Ext.XTemplate('<!DOCTYPE html><html class="x-border-box {htmlClasses}"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type" /><title>{column}/{row}</title>{styles}</head><body class="{bodyClasses}">{[this.showHeader(values)]}<div class="{componentClasses}" style="height:{bodyHeight}px; width:{totalWidth}px">{HTML}</div></body></html>', {
        disableFormats: true,
        showHeader: function (a) {
            if (a.showHeader) {
                return '<div class="sch-pdfprint-header" style="width:' + a.totalWidth + 'px"><h2>' + a.column + "/" + a.row + "</h2></div>"
            }
            return ""
        }
    }),
    exportDialogClassName: "Sch.widget.PdfExportDialog",
    exportDialogConfig: {},
    defaultConfig: {
        format: "A4",
        orientation: "portrait",
        range: "complete",
        showHeader: true
    },
    pageSizes: {
        A5: {
            width: 5.8,
            height: 8.3
        },
        A4: {
            width: 8.3,
            height: 11.7
        },
        A3: {
            width: 11.7,
            height: 16.5
        },
        Letter: {
            width: 8.5,
            height: 11
        }
    },
    openAfterExport: true,
    DPI: 72,
    constructor: function (a) {
        this.callParent(arguments);
        this.addEvents("hidedialogwindow", "showdialogerror", "updateprogressbar")
    },
    init: function (a) {
        this.scheduler = a;
        a.showExportDialog = Ext.Function.bind(this.showExportDialog, this);
        a.doExport = Ext.Function.bind(this.doExport, this)
    },
    showExportDialog: function () {
        var b = this,
            a = b.scheduler.getSchedulingView();
        if (!b.win) {
            b.win = Ext.create(b.exportDialogClassName, {
                plugin: b,
                exportDialogConfig: Ext.apply({
                    startDate: this.scheduler.getStart(),
                    endDate: this.scheduler.getEnd(),
                    rowHeight: a.rowHeight,
                    columnWidth: a.getSingleTickInPixels()
                }, b.exportDialogConfig)
            })
        }
        b.win.show()
    },
    getStylesheets: function () {
        var c = Ext.getDoc().select('link[rel="stylesheet"]'),
            a = Ext.get(Ext.core.DomHelper.createDom({
                tag: "div"
            })),
            b;
        c.each(function (d) {
            a.appendChild(d.dom.cloneNode(true))
        });
        b = a.dom.innerHTML + "";
        return b
    },
    doExport: function (l, i, n) {
        var A = this,
            m = A.scheduler,
            o = m.getSchedulingView(),
            k = A.getStylesheets(),
            y = l || A.defaultConfig;
        A.mask();
        A.fireEvent("updateprogressbar", 0.1);
        if (m.expandAll) {
            m.expandAll()
        }
        var w = m.lockedGrid,
            p = m.normalGrid,
            f = o.rowHeight,
            z = m.timeAxis.getTicks(),
            q = o.getSingleTickInPixels(),
            b = {
                width: m.getWidth(),
                height: m.getHeight(),
                rowHeight: f,
                columnWidth: q,
                startDate: m.getStart(),
                endDate: m.getEnd(),
                normalWidth: p.getWidth(),
                normalPosition: p.getPosition()
            }, u, g;
        if (y.orientation === "landscape") {
            u = A.pageSizes[y.format].height * A.DPI;
            g = A.pageSizes[y.format].width * A.DPI
        } else {
            u = A.pageSizes[y.format].width * A.DPI;
            g = A.pageSizes[y.format].height * A.DPI
        }
        var x = 41,
            t = p.headerCt.getHeight(),
            e = Math.floor(g) - t - (y.showHeader ? x : 0);
        if (y.range !== "complete") {
            var d, a, j, c, r;
            if (y.range === "date") {
                d = new Date(y.dateFrom);
                a = new Date(y.dateTo);
                a = Sch.util.Date.add(a, Sch.util.Date.DAY, 1)
            } else {
                if (y.range === "current") {
                    j = o.getVisibleDateRange();
                    d = j.startDate;
                    a = j.endDate
                }
            }
            c = Math.floor(o.timeAxis.getTickFromDate(d));
            r = Math.floor(o.timeAxis.getTickFromDate(a));
            z = z.filter(function (C, B) {
                return B >= c && B <= r
            });
            m.setTimeSpan(d, a)
        }
        m.setWidth(u);
        m.setTimeColumnWidth(q);
        if (m.ownerCt) {
            m.ownerCt.suspendLayouts()
        }
        var h = A.calculatePages(y, z, q, u, e),
            v = {
                ticks: z,
                printHeight: e,
                paperWidth: u,
                headerHeight: t,
                styles: k,
                config: y
            }, s = A.getExportJsonHtml(h, v);
        A.fireEvent("updateprogressbar", 0.4);
        if (A.printServer) {
            Ext.Ajax.request({
                type: "POST",
                url: A.printServer,
                params: {
                    html: {
                        array: s
                    },
                    format: y.format,
                    orientation: y.orientation,
                    range: y.range
                },
                success: function (B) {
                    A.onSuccess(B, i)
                },
                failure: function (B) {
                    A.onFailure(B, n)
                },
                scope: A
            })
        } else {
            throw "Server url not defined !"
        }
        A.restorePanel(b)
    },
    calculatePages: function (c, p, h, l, b) {
        var m = this,
            n = m.scheduler,
            e = n.lockedGrid,
            a = n.getSchedulingView().rowHeight,
            k = e.getWidth(),
            j = Math.floor(l / h),
            g = Math.floor((l - k) / h),
            d = Math.ceil((p.length - g) / j) + 1,
            o = n.getSchedulingView().store.getCount(),
            i = Math.floor(b / a),
            f = Math.ceil(o / i);
        return {
            columnsAmountLocked: g,
            columnsAmountNormal: j,
            rowsAmount: i,
            rowPages: f,
            columnPages: d,
            timeColumnWidth: h,
            lockedGridWidth: k,
            rowHeight: a,
            panelHTML: {}
        }
    },
    getExportJsonHtml: function (g, y) {
        var B = this,
            n = B.scheduler,
            q = g.columnsAmountLocked,
            s = g.columnsAmountNormal,
            h = g.rowsAmount,
            r = g.rowPages,
            a = g.columnPages,
            o = g.panelHTML,
            p = g.timeColumnWidth,
            x = y.paperWidth,
            d = y.printHeight,
            v = y.headerHeight,
            l = y.styles,
            z = y.config,
            A = y.ticks,
            u = [],
            j, c, m, e, b, f;
        for (var w = 0; w < a; w += 1) {
            if (w === 0) {
                j = Ext.Number.constrain((q - 1), w, (A.length - 1));
                n.setTimeSpan(A[w].start, A[j].end)
            } else {
                if (!c) {
                    c = n.lockedGrid.hide()
                }
                if (A[j + s]) {
                    n.setTimeSpan(A[j + 1].start, A[j + s].end);
                    j = j + s
                } else {
                    n.setTimeSpan(A[j + 1].start, A[A.length - 1].end)
                }
            }
            n.setTimeColumnWidth(p);
            for (var t = 0; t < r; t += 1) {
                B.hideRows(h, t);
                o.dom = n.body.dom.innerHTML;
                o.k = t;
                o.i = w;
                e = B.resizePanelHTML(o);
                m = B.tpl.apply(Ext.apply({
                    bodyClasses: Ext.getBody().dom.className,
                    bodyHeight: d + v,
                    componentClasses: n.el.dom.className,
                    styles: l,
                    showHeader: z.showHeader,
                    HTML: e.dom.innerHTML,
                    totalWidth: x,
                    headerHeight: v,
                    column: w + 1,
                    row: t + 1
                }));
                f = {
                    html: m
                };
                u.push(f);
                B.showRows()
            }
        }
        return Ext.JSON.encode(u)
    },
    resizePanelHTML: function (f) {
        var g = Ext.get(Ext.core.DomHelper.createDom({
            tag: "div",
            html: f.dom
        })),
            b = this.scheduler,
            e = b.lockedGrid,
            c = b.normalGrid;
        var d = [g.select("#" + b.id + "-targetEl").first(), g.select("#" + e.id).first(), g.select("#" + e.body.id).first(), g.select("#" + e.body.child(".x-grid-view").id).first()],
            a = [g.select("#" + c.id).first(), g.select("#" + c.headerCt.id).first(), g.select("#" + c.body.id).first(), g.select("#" + c.getView().id).first()];
        Ext.Array.each(d, function (h) {
            if (h) {
                h.setHeight("100%")
            }
        });
        Ext.Array.each(a, function (i, h) {
            if (h === 1) {
                i.setWidth("100%")
            } else {
                i.applyStyles({
                    height: "100%",
                    width: "100%"
                })
            }
        });
        return g
    },
    onSuccess: function (a, d) {
        var b = this,
            c = Ext.JSON.decode(a.responseText);
        b.fireEvent("updateprogressbar", 1);
        if (c.success === true) {
            setTimeout(function () {
                b.fireEvent("hidedialogwindow");
                b.unmask();
                if (b.openAfterExport) {
                    window.open(c.url, "PDF_Print")
                }
            }, b.win ? b.win.hideTime : 3000)
        } else {
            b.fireEvent("showdialogerror", c.msg);
            b.unmask()
        }
        if (d) {
            d.call(this, a)
        }
    },
    onFailure: function (b, a) {
        this.fireEvent("showdialogerror", this);
        if (a) {
            a.call(this, b)
        }
    },
    hideRows: function (d, f) {
        var c = this.scheduler.lockedGrid.getEl().select(".x-grid-row"),
            a = this.scheduler.normalGrid.getEl().select(".x-grid-row"),
            g = d * f,
            b = g + d;
        for (var e = 0; e < a.elements.length; e += 1) {
            if (e < g || e >= b) {
                c.elements[e].className += " sch-none";
                a.elements[e].className += " sch-none"
            }
        }
    },
    showRows: function () {
        var b = this.scheduler.lockedGrid.getEl().select(".x-grid-row"),
            a = this.scheduler.normalGrid.getEl().select(".x-grid-row");
        b.each(function (c) {
            c.removeCls("sch-none")
        });
        a.each(function (c) {
            c.removeCls("sch-none")
        })
    },
    mask: function () {
        var a = Ext.getBody().mask();
        a.addCls("sch-pdf-mask")
    },
    unmask: function () {
        Ext.getBody().unmask()
    },
    restorePanel: function (a) {
        var b = this.scheduler;
        b.setWidth(a.width);
        b.setHeight(a.height);
        b.setTimeSpan(a.startDate, a.endDate);
        b.setTimeColumnWidth(a.columnWidth, true);
        b.getSchedulingView().setRowHeight(a.rowHeight);
        b.lockedGrid.show();
        b.normalGrid.setWidth(a.normalWidth);
        b.normalGrid.setPosition(a.normalPosition[0]);
        b.ownerCt && b.ownerCt.resumeLayouts()
    },
    destroy: function () {
        if (this.win) {
            this.win.destroy()
        }
    }
});
Ext.define("Sch.widget.ResizePicker", {
    extend: "Ext.Panel",
    alias: "widget.dualrangepicker",
    width: 200,
    height: 200,
    border: true,
    collapsible: false,
    bodyStyle: "position:relative;margin:5px",
    verticalCfg: {
        height: 120,
        value: 24,
        increment: 2,
        minValue: 20,
        maxValue: 80,
        reverse: true
    },
    horizontalCfg: {
        width: 120,
        value: 100,
        minValue: 25,
        increment: 5,
        maxValue: 200
    },
    initComponent: function () {
        var a = this;
        a.addEvents("change", "changecomplete", "select");
        a.horizontalCfg.value = a.dialog.columnWidth;
        a.verticalCfg.value = a.dialog.rowHeight;
        a.dockedItems = [a.vertical = new Ext.slider.Single(Ext.apply({
            dock: "left",
            style: "margin-top:10px",
            vertical: true,
            listeners: {
                change: a.onSliderChange,
                changecomplete: a.onSliderChangeComplete,
                scope: a
            }
        }, a.verticalCfg)), a.horizontal = new Ext.slider.Single(Ext.apply({
            dock: "top",
            style: "margin-left:28px",
            listeners: {
                change: a.onSliderChange,
                changecomplete: a.onSliderChangeComplete,
                scope: a
            }
        }, a.horizontalCfg))];
        a.callParent(arguments)
    },
    afterRender: function () {
        var b = this;
        b.addCls("sch-ux-range-picker");
        b.valueHandle = this.body.createChild({
            cls: "sch-ux-range-value",
            cn: {
                tag: "span"
            }
        });
        b.valueSpan = this.valueHandle.down("span");
        var a = new Ext.dd.DD(this.valueHandle);
        Ext.apply(a, {
            startDrag: function () {
                b.dragging = true;
                this.constrainTo(b.body)
            },
            onDrag: function () {
                b.onHandleDrag.apply(b, arguments)
            },
            endDrag: function () {
                b.onHandleEndDrag.apply(b, arguments);
                b.dragging = false
            },
            scope: this
        });
        this.setValues(this.getValues());
        this.callParent(arguments);
        this.body.on("click", this.onBodyClick, this)
    },
    onBodyClick: function (c, a) {
        var b = [c.getXY()[0] - 8 - this.body.getX(), c.getXY()[1] - 8 - this.body.getY()];
        this.valueHandle.setLeft(Ext.Number.constrain(b[0], 0, this.getAvailableWidth()));
        this.valueHandle.setTop(Ext.Number.constrain(b[1], 0, this.getAvailableHeight()));
        this.setValues(this.getValuesFromXY([this.valueHandle.getLeft(true), this.valueHandle.getTop(true)]));
        this.onSliderChangeComplete()
    },
    getAvailableWidth: function () {
        return this.body.getWidth() - 18
    },
    getAvailableHeight: function () {
        return this.body.getHeight() - 18
    },
    onHandleDrag: function () {
        this.setValues(this.getValuesFromXY([this.valueHandle.getLeft(true), this.valueHandle.getTop(true)]))
    },
    onHandleEndDrag: function () {
        this.setValues(this.getValuesFromXY([this.valueHandle.getLeft(true), this.valueHandle.getTop(true)]))
    },
    getValuesFromXY: function (d) {
        var c = d[0] / this.getAvailableWidth();
        var a = d[1] / this.getAvailableHeight();
        var e = Math.round((this.horizontalCfg.maxValue - this.horizontalCfg.minValue) * c);
        var b = Math.round((this.verticalCfg.maxValue - this.verticalCfg.minValue) * a) + this.verticalCfg.minValue;
        return [e + this.horizontalCfg.minValue, b]
    },
    getXYFromValues: function (d) {
        var b = this.horizontalCfg.maxValue - this.horizontalCfg.minValue;
        var f = this.verticalCfg.maxValue - this.verticalCfg.minValue;
        var a = Math.round((d[0] - this.horizontalCfg.minValue) * this.getAvailableWidth() / b);
        var c = d[1] - this.verticalCfg.minValue;
        var e = Math.round(c * this.getAvailableHeight() / f);
        return [a, e]
    },
    updatePosition: function () {
        var a = this.getValues();
        var b = this.getXYFromValues(this.getValues());
        this.valueHandle.setLeft(Ext.Number.constrain(b[0], 0, this.getAvailableWidth()));
        this.valueHandle.setTop(Ext.Number.constrain(b[1], 0, this.getAvailableHeight()));
        this.positionValueText();
        this.valueSpan.update("[" + a.toString() + "]")
    },
    positionValueText: function () {
        var a = this.valueHandle.getTop(true);
        var b = this.valueHandle.getLeft(true);
        this.valueSpan.setLeft(b > 30 ? -30 : 10);
        this.valueSpan.setTop(a > 10 ? -20 : 20)
    },
    setValues: function (a) {
        this.horizontal.setValue(a[0]);
        if (this.verticalCfg.reverse) {
            this.vertical.setValue(this.verticalCfg.maxValue + this.verticalCfg.minValue - a[1])
        } else {
            this.vertical.setValue(a[1])
        }
        if (!this.dragging) {
            this.updatePosition()
        }
        this.positionValueText();
        this.valueSpan.update("[" + a.toString() + "]")
    },
    getValues: function () {
        var a = this.vertical.getValue();
        if (this.verticalCfg.reverse) {
            a = this.verticalCfg.maxValue - a + this.verticalCfg.minValue
        }
        return [this.horizontal.getValue(), a]
    },
    onSliderChange: function () {
        this.fireEvent("change", this, this.getValues());
        if (!this.dragging) {
            this.updatePosition()
        }
    },
    onSliderChangeComplete: function () {
        this.fireEvent("changecomplete", this, this.getValues())
    },
    afterLayout: function () {
        this.callParent(arguments);
        this.updatePosition()
    }
});
Ext.define("Sch.widget.ExportDialogForm", {
    extend: "Ext.form.Panel",
    dialog: null,
    layout: {
        type: "vbox"
    },
    requires: ["Sch.widget.ResizePicker"],
    border: false,
    bodyPadding: 10,
    initComponent: function () {
        var b = this,
            a = b.dialog;
        Ext.apply(this, {
            fieldDefaults: {
                labelAlign: "top",
                labelWidth: 100,
                labelStyle: "font-weight:bold"
            },
            items: [{
                width: a.getWidth() - 40,
                xtype: "combo",
                value: "complete",
                triggerAction: "all",
                forceSelection: true,
                editable: false,
                fieldLabel: a.rangeFieldLabel,
                name: "range",
                itemId: "rangeField",
                queryMode: "local",
                displayField: "name",
                valueField: "value",
                store: Ext.create("Ext.data.Store", {
                    fields: ["name", "value"],
                    data: [{
                        name: a.completeView,
                        value: "complete"
                    }, {
                        name: a.dateRange,
                        value: "date"
                    }, {
                        name: a.currentView,
                        value: "current"
                    }]
                })
            }, {
                xtype: "dualrangepicker",
                itemId: "rangePicker",
                beforeSubTpl: new Ext.XTemplate('<span class="sch-pdfexportdialog-pickertext">' + a.pickerText + ":</span>"),
                dialog: a,
                hidden: true
            }, {
                width: a.getWidth() - 40,
                xtype: "datefield",
                fieldLabel: b.dateRangeFrom,
                name: "dateFrom",
                itemId: "dateFromField",
                hidden: true,
                allowBlank: false,
                cls: "sch-pdfexportdialog-date",
                beforeSubTpl: new Ext.XTemplate('<span class="sch-pdfexportdialog-datelabel">' + a.dateRangeFrom + ":</span>"),
                maxValue: a.endDate,
                minValue: a.startDate,
                value: a.startDate,
                validator: function (e) {
                    var d = new Date(e);
                    return d >= a.startDate
                }
            }, {
                width: a.getWidth() - 40,
                xtype: "datefield",
                name: "dateTo",
                itemId: "dateToField",
                hidden: true,
                allowBlank: false,
                cls: "sch-pdfexportdialog-date",
                beforeSubTpl: new Ext.XTemplate('<span class="sch-pdfexportdialog-datelabel">' + a.dateRangeTo + ":</span>"),
                maxValue: a.endDate,
                minValue: a.startDate,
                value: a.endDate,
                validator: function (e) {
                    var d = new Date(e);
                    return d <= a.endDate
                }
            }, {
                width: a.getWidth() - 40,
                xtype: "checkboxfield",
                fieldLabel: a.showHeaderLabel,
                name: "showHeader",
                checked: true
            }, {
                width: a.getWidth() - 40,
                xtype: "combo",
                value: "A4",
                triggerAction: "all",
                forceSelection: true,
                editable: false,
                fieldLabel: a.formatFieldLabel,
                name: "format",
                queryMode: "local",
                store: ["A5", "A4", "A3", "Letter"]
            }, {
                width: a.getWidth() - 40,
                xtype: "combo",
                value: "portrait",
                triggerAction: "all",
                forceSelection: true,
                editable: false,
                afterSubTpl: new Ext.XTemplate('<span id="sch-pdfexportdialog-imagePortrait"></span><span id="sch-pdfexportdialog-imageLandscape" class="sch-none"></span>'),
                fieldLabel: a.orientationFieldLabel,
                name: "orientation",
                cls: "sch-pdfexportdialog-orientation",
                itemId: "orientationField",
                displayField: "name",
                valueField: "value",
                queryMode: "local",
                store: Ext.create("Ext.data.Store", {
                    fields: ["name", "value"],
                    data: [{
                        name: a.orientationPortrait,
                        value: "portrait"
                    }, {
                        name: a.orientationLandscape,
                        value: "landscape"
                    }]
                })
            },
            new Ext.ProgressBar({
                text: a.progressBarText,
                width: a.getWidth() - 40,
                animate: true,
                hidden: true,
                itemId: "progressBar",
                id: "print-widget-progressbar"
            })]
        });
        b.callParent(arguments);
        if (!b.progressBar) {
            b.progressBar = new Ext.ProgressBar({
                text: a.progressBarText,
                width: a.getWidth() - 40,
                animate: true,
                hidden: true,
                itemId: "progressBar",
                id: "print-widget-progressbar"
            })
        }
        b.items.add(b.progressBar);
        b.dateFromField = b.getComponent("dateFromField");
        b.dateToField = b.getComponent("dateToField");
        b.rangePicker = b.getComponent("rangePicker");
        b.getComponent("orientationField").on("change", b.onChange, b);
        b.getComponent("rangeField").on("change", b.onChange, b);
        b.form.relayEvents(b.dialog, ["updateprogressbar", "hideprogressbar", "showprogressbar"]);
        var c = {
            hideprogressbar: b.hideProgressBar,
            showprogressbar: b.showProgressBar,
            updateprogressbar: b.updateProgressBar,
            scope: b
        };
        b.form.on(c)
    },
    onChange: function (b, a) {
        if (b.name === "range") {
            switch (a) {
            case "complete":
                this.dateFromField.hide();
                this.dateToField.hide();
                this.rangePicker.hide();
                break;
            case "date":
                this.dateFromField.show();
                this.dateToField.show();
                this.rangePicker.hide();
                break;
            case "current":
                this.dateFromField.hide();
                this.dateToField.hide();
                this.rangePicker.show();
                this.rangePicker.expand(true);
                break
            }
        }
        if (b.name === "orientation") {
            switch (a) {
            case "landscape":
                Ext.get("sch-pdfexportdialog-imagePortrait").toggleCls("sch-none");
                Ext.get("sch-pdfexportdialog-imageLandscape").toggleCls("sch-none");
                break;
            case "portrait":
                Ext.get("sch-pdfexportdialog-imagePortrait").toggleCls("sch-none");
                Ext.get("sch-pdfexportdialog-imageLandscape").toggleCls("sch-none");
                break
            }
        }
    },
    showProgressBar: function () {
        this.progressBar && this.progressBar.show()
    },
    hideProgressBar: function () {
        this.progressBar && this.progressBar.hide()
    },
    updateProgressBar: function (a) {
        this.progressBar && this.progressBar.updateProgress(a)
    },
    destroy: function () {
        this.progressBar && this.progressBar.destroy();
        this.callParent(arguments)
    }
});
Ext.define("Sch.widget.ExportDialogButtons", {
    extend: "Ext.panel.Panel",
    dialog: null,
    height: 35,
    border: false,
    collapsible: false,
    items: [],
    initComponent: function () {
        Ext.apply(this, {
            width: this.dialog.getWidth(),
            items: [{
                xtype: "button",
                scale: "medium",
                text: this.dialog.exportButtonText,
                handler: function () {
                    var b = this.dialog.form.getForm();
                    if (b.isValid()) {
                        var a = b.getValues();
                        this.dialog.fireEvent("showprogressbar");
                        this.dialog.plugin.doExport(a)
                    }
                },
                scope: this
            }, {
                xtype: "button",
                scale: "medium",
                text: this.dialog.cancelButtonText,
                handler: function () {
                    this.dialog.hideDialog()
                },
                scope: this
            }]
        });
        this.callParent(arguments)
    }
});
Ext.define("Sch.widget.PdfExportDialog", {
    extend: "Ext.window.Window",
    alias: "widget.exportdialog",
    modal: false,
    width: 240,
    height: 310,
    cls: "sch-pdfexportdialog",
    frame: false,
    header: false,
    title: null,
    layout: "fit",
    resizable: false,
    draggable: true,
    plugin: null,
    hideTime: 2000,
    formPanel: null,
    buttonsPanel: null,
    progressBar: null,
    items: [],
    tpl: Ext.create("Ext.XTemplate", '<div class="sch-pdfexportdialog-header"><h4>{headerText}</h4><span id="sch-pdfexportdialog-close"></span></div><div class="sch-pdfexportdialog-form" id="sch-pdfexportdialog-form"></div><div class="sch-pdfexportdialog-msg sch-none"><span id="sch-pdfexportdialog-msg"></span></div><div class="sch-pdfexportdialog-button" id="sch-pdfexportdialog-button"></div>', {
        compiled: true
    }),
    generalError: "An error occured, try again.",
    dialogHeader: "PDF Settings",
    formatFieldLabel: "Paper format",
    orientationFieldLabel: "Orientation",
    rangeFieldLabel: "Export range",
    showHeaderLabel: "Add page number",
    orientationPortrait: "Portrait",
    orientationLandscape: "Landscape",
    completeView: "Complete schedule",
    currentView: "Current view",
    dateRange: "Date range",
    dateRangeFrom: "Export from",
    pickerText: "Resize column/rows to desired value",
    dateRangeTo: "Export to",
    exportButtonText: "Export",
    cancelButtonText: "Cancel",
    progressBarText: "Exporting...",
    requires: ["Ext.ProgressBar", "Sch.widget.ExportDialogForm"],
    constructor: function (a) {
        Ext.apply(this, a.exportDialogConfig);
        this.callParent(arguments)
    },
    initComponent: function () {
        var b = this,
            a = {
                hidedialogwindow: b.hideDialog,
                showdialogerror: b.showError,
                updateprogressbar: function (c) {
                    b.fireEvent("updateprogressbar", c)
                },
                scope: this
            };
        b.html = b.tpl.apply({
            headerText: b.dialogHeader
        });
        b.plugin.on(a);
        b.callParent(arguments)
    },
    destroy: function () {
        this.form.destroy();
        this.buttons.destroy();
        this.callParent(arguments)
    },
    afterRender: function () {
        var a = this;
        a.buttons = a.buttonsPanel || new Sch.widget.ExportDialogButtons({
            renderTo: "sch-pdfexportdialog-button",
            dialog: a,
            width: a.getWidth(),
            height: 35
        });
        a.form = a.formPanel || new Sch.widget.ExportDialogForm({
            dialog: a,
            renderTo: "sch-pdfexportdialog-form"
        });
        a.on("changecomplete", function (c, b) {
            a.plugin.scheduler.setTimeColumnWidth(b[0], true);
            if (a.form.rangePicker.verticalCfg.reverse) {
                var d = b[1] - a.form.rangePicker.verticalCfg.maxValue + a.form.rangePicker.verticalCfg.minValue;
                a.plugin.scheduler.getSchedulingView().setRowHeight(d)
            } else {
                a.plugin.scheduler.getSchedulingView().setRowHeight(b[1])
            }
        });
        a.form.on("resize", a.setTipHeight, a);
        a.relayEvents(a.form.rangePicker, ["change", "changecomplete", "select"]);
        Ext.get("sch-pdfexportdialog-close").on("click", a.hideDialog, a)
    },
    setTipHeight: function () {
        var c = this,
            a = c.getHeight(),
            b = c.form.getHeight();
        if (!c.oldFormHeight) {
            c.oldFormHeight = b
        } else {
            c.form.suspendEvents();
            c.setHeight(c.getHeight() + b - c.oldFormHeight);
            c.form.resumeEvents();
            c.oldFormHeight = b
        }
    },
    hideDialog: function () {
        var a = this;
        a.fireEvent("updateprogressbar", 0);
        a.fireEvent("hideprogressbar");
        a.form.show();
        a.form.getForm().reset();
        a.buttons.show();
        a.hide()
    },
    showError: function (c) {
        var b = this,
            a;
        c = c || b.generalErrorText;
        b.fireEvent("hideprogressbar");
        b.form.hide();
        b.buttons.hide();
        a = b.getEl().select(".sch-pdfexportdialog-msg").first();
        a.dom.innerHTML = c;
        a.removeCls("sch-none");
        setTimeout(function () {
            a.dom.innerHTML = "";
            a.addCls("sch-none");
            b.hideDialog()
        }, b.hideTime)
    }
});
Ext.define("Gnt.model.WeekAvailability", {
    extend: "Sch.model.Range",
    customizableFields: [{
        name: "Availability"
    }],
    availabilityField: "Availability",
    set: function (b, a) {
        if (b === this.nameField) {
            Ext.Array.each(this.getAvailability(), function (c) {
                c.setName(a)
            })
        }
        this.callParent(arguments)
    },
    getAvailability: function () {
        return this.get(this.availabilityField) || []
    },
    setAvailability: function (b) {
        var a = this.getName();
        Ext.Array.each(b, function (c) {
            c.setName(a)
        });
        this.set(this.availabilityField, b)
    }
});
Ext.define("Gnt.model.CalendarDay", {
    requires: ["Ext.data.Types"],
    extend: "Sch.model.Customizable",
    idProperty: "Id",
    customizableFields: [{
        name: "Date",
        type: "date",
        dateFormat: "c",
        convert: function (b, a) {
            if (!b) {
                return
            }
            var c = Ext.data.Types.DATE.convert.call(this, b);
            if (c) {
                Ext.Date.clearTime(c)
            }
            if (a.data[a.idProperty] == null) {
                a.data[a.idProperty] = c - 0
            }
            return c
        }
    }, {
        name: "Id"
    }, {
        name: "IsWorkingDay",
        type: "boolean",
        defaultValue: false
    }, {
        name: "Cls",
        defaultValue: "gnt-holiday"
    }, "Name", {
        name: "Availability",
        convert: function (b, a) {
            if (b) {
                return Ext.typeOf(b) === "string" ? [b] : b
            } else {
                return []
            }
        }
    }],
    availabilityCache: null,
    dateField: "Date",
    isWorkingDayField: "IsWorkingDay",
    clsField: "Cls",
    nameField: "Name",
    availabilityField: "Availability",
    setDate: function (b) {
        var a = Ext.Date.clearTime(b, true);
        this.data[this.idProperty] = a - 0;
        this.set(this.dateField, a)
    },
    clearDate: function () {
        this.data[this.idProperty] = null
    },
    getAvailability: function (b) {
        var c = this;
        if (b) {
            return this.get(this.availabilityField)
        }
        if (this.availabilityCache) {
            return this.availabilityCache
        }
        var a = [];
        Ext.Array.each(this.get(this.availabilityField), function (d) {
            a.push(Ext.typeOf(d) === "string" ? c.parseInterval(d) : d)
        });
        this.verifyAvailability(a);
        return this.availabilityCache = a
    },
    setAvailability: function (a) {
        this.availabilityCache = null;
        this.set(this.availabilityField, this.stringifyIntervals(a));
        this.getAvailability()
    },
    verifyAvailability: function (b) {
        b.sort(function (f, e) {
            return f.startTime - e.startTime
        });
        Ext.Array.each(b, function (e) {
            if (e.startTime > e.endTime) {
                throw "Start time is greater than end time"
            }
        });
        for (var a = 1; a < b.length; a++) {
            var c = b[a - 1];
            var d = b[a];
            if (c.endTime > d.startTime) {
                throw "Availability intervals should not intersect"
            }
        }
    },
    prependZero: function (a) {
        return a < 10 ? "0" + a : a
    },
    stringifyInterval: function (b) {
        var c = b.startTime;
        var a = b.endTime;
        return this.prependZero(c.getHours()) + ":" + this.prependZero(c.getMinutes()) + "-" + this.prependZero(a.getHours()) + ":" + this.prependZero(a.getMinutes())
    },
    stringifyIntervals: function (b) {
        var c = this;
        var a = [];
        Ext.Array.each(b, function (d) {
            if (Ext.typeOf(d) === "string") {
                a.push(d)
            } else {
                a.push(c.stringifyInterval(d))
            }
        });
        return a
    },
    parseInterval: function (b) {
        var a = /(\d\d):(\d\d)-(\d\d):(\d\d)/.exec(b);
        if (!a) {
            throw "Invalid format for availability string: " + b + ". It should have exact format: hh:mm-hh:mm"
        }
        return {
            startTime: new Date(0, 0, 0, a[1], a[2]),
            endTime: new Date(0, 0, 0, a[3], a[4])
        }
    },
    getTotalHours: function () {
        return this.getTotalMS() / 1000 / 60 / 60
    },
    getTotalMS: function () {
        var a = 0;
        Ext.Array.each(this.getAvailability(), function (b) {
            a += b.endTime - b.startTime
        });
        return a
    },
    addAvailabilityInterval: function (d, b) {
        var a;
        if (d instanceof Date) {
            a = {
                startTime: d,
                endTime: b
            }
        } else {
            a = this.parseInterval(d + (b ? "-" + b : ""))
        }
        var c = this.getAvailability().concat(a);
        this.verifyAvailability(c);
        this.setAvailability(c)
    },
    removeAvailbilityInterval: function (a) {
        var b = this.getAvailability();
        b.splice(a, 1);
        this.setAvailability(b)
    },
    getAvailabilityIntervalsFor: function (d) {
        d = typeof d == "number" ? new Date(d) : d;
        var c = d.getFullYear();
        var e = d.getMonth();
        var b = d.getDate();
        var a = [];
        Ext.Array.each(this.getAvailability(), function (f) {
            var g = f.endTime.getDate();
            a.push({
                startDate: new Date(c, e, b, f.startTime.getHours(), f.startTime.getMinutes()),
                endDate: new Date(c, e, b + (g == 1 ? 1 : 0), f.endTime.getHours(), f.endTime.getMinutes())
            })
        });
        return a
    },
    getAvailabilityStartFor: function (b) {
        var a = this.getAvailabilityIntervalsFor(b);
        if (!a.length) {
            return null
        }
        return a[0].startDate
    },
    getAvailabilityEndFor: function (b) {
        var a = this.getAvailabilityIntervalsFor(b);
        if (!a.length) {
            return null
        }
        return a[a.length - 1].endDate
    }
});
Ext.define("Gnt.model.Assignment", {
    extend: "Sch.model.Customizable",
    idProperty: "Id",
    customizableFields: [{
        name: "Id"
    }, {
        name: "ResourceId"
    }, {
        name: "TaskId"
    }, {
        name: "Units",
        type: "float",
        defaultValue: 100
    }],
    resourceIdField: "ResourceId",
    taskIdField: "TaskId",
    unitsField: "Units",
    isPersistable: function () {
        var a = this.getTask(),
            b = this.getResource();
        return a && !a.phantom && b && !b.phantom
    },
    getUnits: function () {
        return Math.max(0, this.get(this.unitsField))
    },
    setUnits: function (a) {
        if (a < 0) {
            throw "`Units` value for an assignment can't be less than 0"
        }
        this.set(this.unitsField, a)
    },
    getResourceName: function () {
        var a = this.stores[0].getResourceStore().getById(this.getResourceId());
        if (a) {
            return a.getName()
        }
        return ""
    },
    getTask: function (a) {
        return (a || this.stores[0].getTaskStore()).getById(this.getTaskId())
    },
    getResource: function () {
        return this.stores[0].getResourceStore().getByInternalId(this.getResourceId())
    },
    getInternalId: function () {
        return this.getId() || this.internalId
    },
    getEffort: function (b) {
        var a = this.getTask();
        var c = 0;
        a.forEachAvailabilityIntervalWithResources({
            startDate: a.getStartDate(),
            endDate: a.getEndDate(),
            resources: [this.getResource()]
        }, function (g, f, e) {
            var h;
            for (var d in e) {
                h = e[d].units
            }
            c += (f - g) * h / 100
        });
        return a.getProjectCalendar().convertMSDurationToUnit(c, b || a.getEffortUnit())
    }
});
Ext.define("Gnt.model.Dependency", {
    extend: "Sch.model.Customizable",
    inheritableStatics: {
        Type: {
            StartToStart: 0,
            StartToEnd: 1,
            EndToStart: 2,
            EndToEnd: 3
        }
    },
    idProperty: "Id",
    customizableFields: [{
        name: "Id"
    }, {
        name: "From"
    }, {
        name: "To"
    }, {
        name: "Type",
        type: "int",
        defaultValue: 2
    }, {
        name: "Lag",
        type: "int",
        defaultValue: 0
    }, {
        name: "Cls"
    }],
    fromField: "From",
    toField: "To",
    typeField: "Type",
    lagField: "Lag",
    clsField: "Cls",
    constructor: function (a) {
        this.callParent(arguments);
        if (a) {
            if (a.fromTask) {
                if (a.fromTask instanceof Gnt.model.Task) {
                    this.setSourceTask(a.fromTask)
                } else {
                    this.setSourceId(a.fromTask)
                }
            }
            if (a.toTask) {
                if (a.toTask instanceof Gnt.model.Task) {
                    this.setTargetTask(a.toTask)
                } else {
                    this.setTargetId(a.toTask)
                }
            }
            if (Ext.isDefined(a.type)) {
                this.setType(a.type)
            }
        }
    },
    getTaskStore: function () {
        return this.stores[0].taskStore
    },
    getSourceTask: function (a) {
        return this.getTaskStore().getById(this.getSourceId())
    },
    setSourceTask: function (a) {
        this.setSourceId(a.getId() || a.internalId)
    },
    getTargetTask: function () {
        return this.getTaskStore().getById(this.getTargetId())
    },
    setTargetTask: function (a) {
        this.setTargetId(a.getId() || a.internalId)
    },
    getSourceId: function () {
        return this.get(this.fromField)
    },
    setSourceId: function (a) {
        this.set(this.fromField, a)
    },
    getTargetId: function () {
        return this.get(this.toField)
    },
    setTargetId: function (a) {
        this.set(this.toField, a)
    },
    isPersistable: function () {
        var a = this.getSourceTask(),
            b = this.getTargetTask();
        return a && !a.phantom && b && !b.phantom
    },
    isValid: function (a) {
        var b = this.callParent(arguments);
        if (b && this.stores[0]) {
            b = this.stores[0].isValidDependency(this.getSourceId(), this.getTargetId(), true)
        }
        return b
    }
});
Ext.define("Gnt.model.Resource", {
    extend: "Sch.model.Resource",
    customizableFields: ["CalendarId"],
    calendarIdField: "CalendarId",
    getTaskStore: function () {
        return this.stores[0].getTaskStore()
    },
    getEventStore: function () {
        return this.getTaskStore()
    },
    getEvents: function () {
        return this.getTasks()
    },
    getTasks: function () {
        var a = [];
        this.forEachAssignment(function (b) {
            var c = b.getTask();
            if (c) {
                a.push(c)
            }
        });
        return a
    },
    getCalendar: function (a) {
        return a ? this.getOwnCalendar() : this.getOwnCalendar() || this.getProjectCalendar()
    },
    getOwnCalendar: function () {
        var a = this.getCalendarId();
        return a ? Gnt.data.Calendar.getCalendar(a) : null
    },
    getProjectCalendar: function () {
        return this.stores[0].getTaskStore().getCalendar()
    },
    setCalendar: function (a) {},
    getInternalId: function () {
        return this.getId() || this.internalId
    },
    assignTo: function (a, c) {
        var b = a instanceof Gnt.model.Task ? a : this.getTaskStore().getById(a);
        return b.assign(this, c)
    },
    unassignFrom: function () {
        return this.unAssignFrom.apply(this, arguments)
    },
    unAssignFrom: function (a) {
        var b = a instanceof Gnt.model.Task ? a : this.getTaskStore().getById(a);
        b.unAssign(this)
    },
    forEachAssignment: function (b, a) {
        a = a || this;
        var c = this.getInternalId();
        this.getTaskStore().getAssignmentStore().each(function (d) {
            if (d.getResourceId() == c) {
                return b.call(a, d)
            }
        })
    },
    collectAvailabilityIntervalPoints: function (e, f, b, h, c) {
        for (var d = 0; d < e.length; d++) {
            var a = e[d];
            var g = a.startDate - 0;
            var i = a.endDate - 0;
            if (!h[g]) {
                h[g] = [];
                c.push(g)
            }
            h[g].push(f(g));
            if (!h[i]) {
                h[i] = [];
                c.push(i)
            }
            h[i].push(b(i))
        }
    },
    forEachAvailabilityIntervalWithTasks: function (d, f, a) {
        a = a || this;
        var c = d.startDate;
        var t = d.endDate;
        if (!c || !t) {
            throw "Both `startDate` and `endDate` are required for `forEachAvailabilityIntervalWithTasks`"
        }
        var g = new Date(c);
        var u = d.includeAllIntervals;
        var p = this.getCalendar();
        var l = [];
        var n = [];
        var b = [];
        this.forEachAssignment(function (k) {
            var i = k.getTask();
            if (i.getStartDate() > t || i.getEndDate() < c) {
                return
            }
            n.push(i);
            b.push(i.getCalendar());
            l.push(k)
        });
        if (!n.length) {
            return
        }
        var e = Sch.util.Date;
        var y = [c - 0, t - 0];
        var j = {};
        j[c - 0] = [{
            type: "00-intervalStart"
        }];
        j[t - 0] = [{
            type: "00-intervalEnd"
        }];
        var s;
        while (g < t) {
            this.collectAvailabilityIntervalPoints(p.getAvailabilityIntervalsFor(g), function () {
                return {
                    type: "00-resourceAvailabilityStart"
                }
            }, function () {
                return {
                    type: "01-resourceAvailabilityEnd"
                }
            }, j, y);
            for (s = 0; s < b.length; s++) {
                this.collectAvailabilityIntervalPoints(b[s].getAvailabilityIntervalsFor(g), function () {
                    return {
                        type: "02-taskAvailabilityStart",
                        assignment: l[s],
                        taskId: n[s].getInternalId(),
                        units: l[s].getUnits()
                    }
                }, function () {
                    return {
                        type: "03-taskAvailabilityEnd",
                        taskId: n[s].getInternalId()
                    }
                }, j, y)
            }
            g = e.getStartOfNextDay(g)
        }
        y.sort();
        var v = false;
        var w = {};
        var m = 0;
        for (s = 0; s < y.length - 1; s++) {
            var r = j[y[s]];
            r.sort(function (k, i) {
                return k.type < i.type
            });
            for (var q = 0; q < r.length; q++) {
                var o = r[q];
                if (o.type == "00-resourceAvailabilityStart") {
                    v = true
                }
                if (o.type == "01-resourceAvailabilityEnd") {
                    v = false
                }
                if (o.type == "02-taskAvailabilityStart") {
                    w[o.taskId] = o;
                    m++
                }
                if (o.type == "03-taskAvailabilityEnd") {
                    delete w[o.taskId];
                    m--
                }
            }
            if (u || v && m) {
                var x = y[s];
                var h = y[s + 1];
                if (x > t || h < c) {
                    continue
                }
                if (x < c) {
                    x = c - 0
                }
                if (h > t) {
                    h = t - 0
                }
                if (f.call(a, x, h, w) === false) {
                    return false
                }
            }
        }
    },
    getAllocationInfo: function (a) {
        var b = [];
        this.forEachAvailabilityIntervalWithTasks(a, function (h, g, f) {
            var e = 0;
            var c = [];
            for (var d in f) {
                e += f[d].units;
                c.push(f[d].assignment)
            }
            b.push({
                startDate: new Date(h),
                endDate: new Date(g),
                totalAllocation: e,
                assignments: c
            })
        });
        return b
    }
});
Ext.define("Gnt.model.task.More", {
    indent: function () {
        var a = this.previousSibling;
        if (a) {
            this.isMove = true;
            a.appendChild(this);
            delete this.isMove;
            a.set("leaf", false);
            a.expand()
        }
    },
    outdent: function () {
        var a = this.parentNode;
        if (a && !a.isRoot()) {
            a.set("leaf", a.childNodes.length === 1);
            this.isMove = true;
            if (a.nextSibling) {
                a.parentNode.insertBefore(this, a.nextSibling)
            } else {
                a.parentNode.appendChild(this)
            }
            delete this.isMove
        }
    },
    getAllDependencies: function (a) {
        a = a || this.getDependencyStore();
        return a.getDependenciesForTask(this)
    },
    hasIncomingDependencies: function (a) {
        var c = this.getId() || this.internalId;
        a = a || this.getDependencyStore();
        var b = a.findBy(function (d) {
            return d.getTargetId() == c
        });
        return b >= 0
    },
    getIncomingDependencies: function (a) {
        a = a || this.getDependencyStore();
        return a.getIncomingDependenciesForTask(this)
    },
    getOutgoingDependencies: function (a) {
        a = a || this.getDependencyStore();
        return a.getOutgoingDependenciesForTask(this)
    },
    constrain: function (c) {
        if (this.isManuallyScheduled()) {
            return false
        }
        var e = false;
        c = c || this.getTaskStore();
        var b = this.getConstrainContext(c);
        if (b) {
            var a = b.startDate;
            var d = b.endDate;
            if (a && a - this.getStartDate() !== 0) {
                this.setStartDate(a, true, c.skipWeekendsDuringDragDrop);
                e = true
            } else {
                if (d && d - this.getEndDate() !== 0) {
                    this.setEndDate(d, true, c.skipWeekendsDuringDragDrop);
                    e = true
                }
            }
        }
        return e
    },
    getConstrainContext: function (f) {
        var g = this.getIncomingDependencies();
        if (!g.length) {
            return null
        }
        var h = f || this.getTaskStore(),
            a = Gnt.model.Dependency.Type,
            c = new Date(0),
            b = new Date(0),
            i = Ext.Date,
            e = this.getCalendar(),
            d;
        Ext.each(g, function (l) {
            var k = l.getSourceTask();
            if (k) {
                var n = l.getLag() || 0,
                    m = k.getStartDate(),
                    j = k.getEndDate();
                switch (l.getType()) {
                case a.StartToEnd:
                    m = e.skipWorkingDays(m, n);
                    if (b < m) {
                        b = m;
                        d = k
                    }
                    break;
                case a.StartToStart:
                    m = e.skipWorkingDays(m, n);
                    if (c < m) {
                        c = m;
                        d = k
                    }
                    break;
                case a.EndToStart:
                    j = e.skipWorkingDays(j, n);
                    if (c < j) {
                        c = j;
                        d = k
                    }
                    break;
                case a.EndToEnd:
                    j = e.skipWorkingDays(j, n);
                    if (b < j) {
                        b = j;
                        d = k
                    }
                    break;
                default:
                    throw "Invalid dependency type: " + l.getType()
                }
            }
        });
        return {
            startDate: c > 0 ? c : null,
            endDate: b > 0 ? b : null,
            constrainingTask: d
        }
    },
    getCriticalPaths: function () {
        var b = [this],
            a = this.getConstrainContext();
        while (a) {
            b.push(a.constrainingTask);
            a = a.constrainingTask.getConstrainContext()
        }
        return b
    },
    cascadeChanges: function (a, b) {
        a = a || this.getTaskStore();
        if (this.isLeaf()) {
            if (this.constrain(a)) {
                this.recalculateParents();
                b.nbrAffected++
            }
        }
        Ext.each(this.getOutgoingDependencies(), function (c) {
            var d = c.getTargetTask();
            if (d && !d.isManuallyScheduled()) {
                d.cascadeChanges(a, b)
            }
        })
    },
    addSubtask: function (a) {
        this.set("leaf", false);
        this.appendChild(a);
        this.expand()
    },
    addSuccessor: function (b) {
        var c = this.rec,
            e = this.getTaskStore(),
            d = this.getDependencyStore();
        b = b || new this.self();
        b.calendar = b.calendar || this.getCalendar();
        b.taskStore = e;
        b.setStartDate(this.getEndDate(), true, e.skipWeekendsDuringDragDrop);
        b.setDuration(1, Sch.util.Date.DAY);
        this.addTaskBelow(b);
        var a = new d.model({
            fromTask: this,
            toTask: b,
            type: d.model.Type.EndToStart
        });
        d.add(a)
    },
    addMilestone: function (c) {
        var b = this.getTaskStore();
        c = c || new this.self();
        var a = this.getEndDate();
        if (a) {
            c.calendar = c.calendar || this.getCalendar();
            c.setStartEndDate(a, a, b.skipWeekendsDuringDragDrop)
        }
        this.addTaskBelow(c)
    },
    addPredecessor: function (c) {
        var b = this.getDependencyStore();
        c = c || new this.self();
        c.calendar = c.calendar || this.getCalendar();
        c.beginEdit();
        c.set(this.startDateField, c.calculateStartDate(this.getStartDate(), 1, Sch.util.Date.DAY));
        c.set(this.endDateField, this.getStartDate());
        c.set(this.durationField, 1);
        c.set(this.durationUnitField, Sch.util.Date.DAY);
        c.endEdit();
        this.addTaskAbove(c);
        var a = new b.model({
            fromTask: c,
            toTask: this,
            type: b.model.Type.EndToStart
        });
        b.add(a)
    },
    getSuccessors: function () {
        var h = this.getId() || this.internalId;
        var e = e || this.getDependencyStore();
        var c = this.getTaskStore(),
            g = [];
        for (var f = 0, a = e.getCount(); f < a; f++) {
            var d = e.getAt(f);
            if (d.getSourceId() == h) {
                var b = d.getTargetTask();
                if (b) {
                    g.push(b)
                }
            }
        }
        return g
    },
    getPredecessors: function () {
        var g = this.getId() || this.internalId;
        var d = d || this.getDependencyStore();
        var b = this.getTaskStore(),
            f = [];
        for (var e = 0, a = d.getCount(); e < a; e++) {
            var c = d.getAt(e);
            if (c.getTargetId() == g) {
                f.push(c.getSourceTask())
            }
        }
        return f
    },
    addTaskAbove: function (a) {
        a = a || new this.self();
        this.parentNode.insertBefore(a, this)
    },
    addTaskBelow: function (a) {
        a = a || new this.self();
        if (this.nextSibling) {
            this.parentNode.insertBefore(a, this.nextSibling)
        } else {
            this.parentNode.appendChild(a)
        }
    },
    isAbove: function (a) {
        var b = this,
            c = Math.min(b.data.depth, a.data.depth);
        while (b.data.depth > c) {
            b = b.parentNode
        }
        while (a.data.depth > c) {
            a = a.parentNode
        }
        while (a.parentNode !== b.parentNode) {
            a = a.parentNode;
            b = b.parentNode
        }
        return a.data.index > b.data.index
    }
});
Ext.define("Gnt.model.Task", {
    extend: "Sch.model.Range",
    requires: ["Sch.util.Date", "Ext.data.NodeInterface"],
    mixins: ["Gnt.model.task.More"],
    idProperty: "Id",
    customizableFields: [{
        name: "Id"
    }, {
        name: "Duration",
        type: "number",
        useNull: true
    }, {
        name: "Effort",
        type: "number",
        useNull: true
    }, {
        name: "EffortUnit",
        type: "string",
        defaultValue: "h"
    }, {
        name: "CalendarId",
        type: "string"
    }, {
        name: "DurationUnit",
        type: "string",
        defaultValue: "d",
        convert: function (a) {
            return a || "d"
        }
    }, {
        name: "PercentDone",
        type: "int",
        defaultValue: 0
    }, {
        name: "ManuallyScheduled",
        type: "boolean",
        defaultValue: false
    }, {
        name: "SchedulingMode",
        type: "string",
        defaultValue: "Normal"
    }, {
        name: "BaselineStartDate",
        type: "date",
        dateFormat: "c"
    }, {
        name: "BaselineEndDate",
        type: "date",
        dateFormat: "c"
    }, {
        name: "BaselinePercentDone",
        type: "int",
        defaultValue: 0
    }, {
        name: "Draggable",
        type: "boolean",
        persist: false,
        defaultValue: true
    }, {
        name: "Resizable",
        persist: false
    }, {
        name: "PhantomId",
        type: "string"
    }, {
        name: "PhantomParentId",
        type: "string"
    }],
    draggableField: "Draggable",
    resizableField: "Resizable",
    nameField: "Name",
    durationField: "Duration",
    durationUnitField: "DurationUnit",
    effortField: "Effort",
    effortUnitField: "EffortUnit",
    percentDoneField: "PercentDone",
    manuallyScheduledField: "ManuallyScheduled",
    schedulingModeField: "SchedulingMode",
    calendarIdField: "CalendarId",
    baselineStartDateField: "BaselineStartDate",
    baselineEndDateField: "BaselineEndDate",
    baselinePercentDoneField: "BaselinePercentDone",
    calendar: null,
    dependencyStore: null,
    taskStore: null,
    phantomIdField: "PhantomId",
    phantomParentIdField: "PhantomParentId",
    normalized: false,
    recognizedSchedulingModes: ["Normal", "Manual", "FixedDuration", "EffortDriven", "DynamicAssignment"],
    constructor: function () {
        this.getModifiedFieldNames = function () {
            if (this.__isFilling__) {
                return []
            }
            delete this.getModifiedFieldNames;
            return this.getModifiedFieldNames()
        };
        this.callParent(arguments)
    },
    normalize: function () {
        var c = this.getDuration(),
            g = this.getDurationUnit(),
            b = this.getStartDate(),
            f = this.getEndDate(),
            e = this.getSchedulingMode(),
            d = this.data;
        if (f && this.inclusiveEndDate) {
        	 var i = this.fields.getByKey(this.endDateField).dateFormat;
            var a = (i && !Ext.Date.formatContainsHourInfo(i)) || (f.getHours() === 0 && f.getMinutes() === 0 && f.getSeconds() === 0 && f.getMilliseconds() === 0);
            if (a) {
                if (Ext.isNumber(c)) {
                    f = d[this.endDateField] = this.calculateEndDate(b, c, g)
                } else {
                    f = d[this.endDateField] = Ext.Date.add(f, Ext.Date.DAY, 1)
                }
            }
        }
        if (c == null && b && f) {
            d[this.durationField] = this.calculateDuration(b, f, g)
        }
        if ((e == "Normal" || this.isManuallyScheduled()) && f == null && b && Ext.isNumber(c)) {
            d[this.endDateField] = this.calculateEndDate(b, c, g)
        }
        if (e == "EffortDriven" || e == "FixedDuration") {
            var j = this.get(this.effortField),
                h = this.getEffortUnit();
            if (j == null && b && f) {
                d[this.effortField] = this.calculateEffort(b, f, h)
            }
            if (f == null && b && j) {
                d[this.endDateField] = this.calculateEffortDrivenEndDate(b, j, h);
                if (c == null) {
                    d[this.durationField] = this.calculateDuration(b, d[this.endDateField], g)
                }
            }
        }
        this.normalized = true
    },
    normalizeEffort: function () {
        var c = this.childNodes;
        var b = 0;
        for (var a = 0; a < c.length; a++) {
            var d = c[a];
            if (!d.isLeaf()) {
                d.normalizeEffort()
            }
            b += d.getEffort("MILLI")
        }
        if (this.getEffort("MILLI") != b) {
            this.data[this.effortField] = this.getProjectCalendar().convertMSDurationToUnit(b, this.getEffortUnit())
        }
    },
    getInternalId: function () {
        return this.getId() || this.internalId
    },
    getCalendar: function (a) {
        return a ? this.getOwnCalendar() : this.getOwnCalendar() || this.getProjectCalendar()
    },
    getOwnCalendar: function () {
        var a = this.get(this.calendarIdField);
        return a ? Gnt.data.Calendar.getCalendar(a) : this.calendar
    },
    getProjectCalendar: function () {
        var a = this.stores[0];
        var b = a && a.getCalendar && a.getCalendar() || this.parentNode && this.parentNode.getProjectCalendar() || this.isRoot() && this.calendar;
        if (!b) {
            Ext.Error.raise("Can't find a project calendar in `getProjectCalendar`")
        }
        return b
    },
    setCalendar: function (a) {
        this.calendar = a
    },
    getDependencyStore: function () {
        var a = this.dependencyStore || this.getTaskStore().dependencyStore;
        if (!a) {
            Ext.Error.raise("Can't find a dependencyStore in `getDependencyStore`")
        }
        return a
    },
    getResourceStore: function () {
        return this.getTaskStore().getResourceStore()
    },
    getAssignmentStore: function () {
        return this.getTaskStore().getAssignmentStore()
    },
    getTaskStore: function (b) {
        if (this.taskStore) {
            return this.taskStore
        }
        var a = this.stores[0] && this.stores[0].taskStore || this.parentNode && this.parentNode.getTaskStore(b);
        if (!a && !b) {
            Ext.Error.raise("Can't find a taskStore in `getTaskStore`")
        }
        return this.taskStore = a
    },
    isManuallyScheduled: function () {
        return this.get(this.schedulingModeField) == "Manual" || this.get(this.manuallyScheduledField)
    },
    setManuallyScheduled: function (a) {
        if (a) {
            this.set(this.schedulingModeField, "Manual")
        } else {
            if (this.get(this.schedulingModeField) == "Manual") {
                this.set(this.schedulingModeField, "Normal")
            }
        }
        return this.set(this.manuallyScheduledField, a)
    },
    setSchedulingMode: function (a) {
        if (Ext.Array.indexOf(this.recognizedSchedulingModes, a) == -1) {
            throw "Unrecognized scheduling mode: " + a
        }
        this.beginEdit();
        this.set(this.schedulingModeField, a);
        if (a === "FixedDuration") {
            this.updateEffortBasedOnDuration()
        }
        if (a === "EffortDriven") {
            this.updateDurationBasedOnEffort()
        }
        this.endEdit()
    },
    skipNonWorkingTime: function (b, c) {
        var a = false;
        this.forEachAvailabilityIntervalWithResources(c ? {
            startDate: b
        } : {
            endDate: b,
            isForward: false
        }, function (f, e, d) {
            b = c ? f : e;
            a = true;
            return false
        });
        return a ? new Date(b) : this.getCalendar().skipNonWorkingTime(b, c)
    },
    setStartDate: function (a, f, e) {
        this.beginEdit();
        var d = this.getCalendar();
        if (e && !this.isManuallyScheduled()) {
            if (!this.isMilestone() || d.isHoliday(a - 1)) {
                a = this.skipNonWorkingTime(a, true)
            }
        }
        var b = this.getSchedulingMode();
        this.set(this.startDateField, a);
        if (f !== false) {
            if (b == "EffortDriven") {
                this.set(this.endDateField, this.calculateEffortDrivenEndDate(a, this.getEffort()))
            } else {
                var c = this.getDuration();
                if (Ext.isNumber(c)) {
                    this.set(this.endDateField, this.calculateEndDate(a, c, this.getDurationUnit()))
                }
            }
        } else {
            if (this.getEndDate()) {
                this.set(this.durationField, this.calculateDuration(a, this.getEndDate(), this.getDurationUnit()))
            }
        }
        this.onPotentialEffortChange();
        this.endEdit()
    },
    setEndDate: function (a, e, d) {
        this.beginEdit();
        var c = this.getCalendar();
        if (d && !this.isManuallyScheduled()) {
            a = this.skipNonWorkingTime(a, false)
        }
        if (e !== false) {
            var b = this.getDuration();
            if (Ext.isNumber(b)) {
                this.set(this.startDateField, this.calculateStartDate(a, b, this.getDurationUnit()));
                this.set(this.endDateField, a)
            } else {
                this.set(this.endDateField, a)
            }
        } else {
            this.set(this.endDateField, a);
            if (this.getStartDate()) {
                this.set(this.durationField, this.calculateDuration(this.getStartDate(), a, this.getDurationUnit()))
            }
        }
        this.onPotentialEffortChange();
        this.endEdit()
    },
    setStartEndDate: function (a, b, c) {
        this.beginEdit();
        if (c && !this.isManuallyScheduled()) {
            a = a && this.skipNonWorkingTime(a, true);
            b = b && this.skipNonWorkingTime(b, false)
        }
        this.set(this.startDateField, a);
        this.set(this.endDateField, b);
        this.set(this.durationField, this.calculateDuration(a, b, this.getDurationUnit()));
        this.onPotentialEffortChange();
        this.endEdit()
    },
    getDuration: function (a) {
        if (!a) {
            return this.get(this.durationField)
        }
        var b = this.getProjectCalendar(),
            c = b.convertDurationToMs(this.get(this.durationField), this.get(this.durationUnitField));
        return b.convertMSDurationToUnit(c, a)
    },
    getEffort: function (a) {
        var b = this.get(this.effortField) || 0;
        if (!a) {
            return b
        }
        var c = this.getProjectCalendar(),
            d = c.convertDurationToMs(b, this.get(this.effortUnitField));
        return c.convertMSDurationToUnit(d, a)
    },
    setEffort: function (b, a) {
        a = a || this.get(this.effortUnitField);
        this.beginEdit();
        this.set(this.effortField, b);
        this.set(this.effortUnitField, a);
        if (this.getSchedulingMode() === "EffortDriven") {
            this.updateDurationBasedOnEffort()
        }
        if (this.getSchedulingMode() === "DynamicAssignment") {
            this.updateAssignments()
        }
        this.endEdit()
    },
    getCalendarDuration: function (a) {
        return this.getProjectCalendar().convertMSDurationToUnit(this.getEndDate() - this.getStartDate(), a || this.get(this.durationUnitField))
    },
    setDuration: function (b, a) {
        a = a || this.get(this.durationUnitField);
        this.beginEdit();
        this.set(this.endDateField, this.calculateEndDate(this.getStartDate(), b, a));
        this.set(this.durationField, b);
        this.set(this.durationUnitField, a);
        this.onPotentialEffortChange();
        this.endEdit()
    },
    calculateStartDate: function (e, d, c) {
        c = c || this.getDurationUnit();
        if (this.isManuallyScheduled()) {
            return Sch.util.Date.add(a, c, - d)
        } else {
            if (this.getTaskStore(true) && this.hasAssignments()) {
                var b = this.getProjectCalendar().convertDurationToMs(d, c || this.getDurationUnit());
                var a;
                this.forEachAvailabilityIntervalWithResources({
                    endDate: e,
                    isForward: false
                }, function (i, h, g) {
                    var f = h - i;
                    if (f >= b) {
                        a = new Date(h - b);
                        return false
                    } else {
                        b -= f
                    }
                });
                return a
            } else {
                return this.getCalendar().calculateStartDate(e, d, c)
            }
        }
    },
    calculateEndDate: function (a, e, c) {
        c = c || this.getDurationUnit();
        if (this.isManuallyScheduled()) {
            return Sch.util.Date.add(a, c, e)
        } else {
            if (this.getTaskStore(true) && this.hasAssignments()) {
                var b = this.getProjectCalendar().convertDurationToMs(e, c || this.getDurationUnit());
                var d;
                this.forEachAvailabilityIntervalWithResources({
                    startDate: a
                }, function (i, h, g) {
                    var f = h - i;
                    if (f >= b) {
                        d = new Date(i + b);
                        return false
                    } else {
                        b -= f
                    }
                });
                return d
            } else {
                return this.getCalendar().calculateEndDate(a, e, c)
            }
        }
    },
    calculateDuration: function (a, c, b) {
        b = b || this.getDurationUnit();
        if (!a || !c) {
            return 0
        }
        if (this.isManuallyScheduled()) {
            return this.getProjectCalendar().convertMSDurationToUnit(c - a, b)
        } else {
            if (this.getTaskStore(true) && this.hasAssignments()) {
                var d = 0;
                this.forEachAvailabilityIntervalWithResources({
                    startDate: a,
                    endDate: c
                }, function (g, f, e) {
                    d += f - g
                });
                return this.getProjectCalendar().convertMSDurationToUnit(d, b)
            } else {
                return this.getCalendar().calculateDuration(a, c, b)
            }
        }
    },
    forEachAvailabilityIntervalWithResources: function (f, h, a) {
        a = a || this;
        var C = this;
        var d = f.startDate;
        var z = f.endDate;
        var p = f.isForward !== false;
        if (p ? !d : !z) {
            throw new Error("At least `startDate` or `endDate` is required, depending from the `isForward` option")
        }
        var j = new Date(p ? d : z);
        var b = f.includeEmptyIntervals;
        var c = this.getOwnCalendar();
        var G = Boolean(c);
        var E = this.getProjectCalendar();
        var A, v, r;
        if (f.resources) {
            A = f.resources;
            r = [];
            v = [];
            Ext.each(A, function (i) {
                v.push(i.getCalendar());
                r.push(C.getAssignmentFor(i))
            })
        } else {
            r = this.getAssignments();
            if (!r.length) {
                return
            }
            A = [];
            v = [];
            Ext.each(r, function (k) {
                var i = k.getResource();
                A.push(i);
                v.push(i.getCalendar())
            })
        }
        var g = Sch.util.Date;
        var y, u, B, D, n;
        var t = p ? !z : !d;
        while (t || (p ? j < z : j > d)) {
            var q = {};
            var F = [];
            if (G) {
                var l = c.getAvailabilityIntervalsFor(j - (p ? 0 : 1));
                for (u = 0; u < l.length; u++) {
                    B = l[u];
                    D = B.startDate - 0;
                    n = B.endDate - 0;
                    if (!q[D]) {
                        q[D] = [];
                        F.push(D)
                    }
                    q[D].push({
                        type: "00-taskAvailailabilityStart",
                        typeBackward: "01-taskAvailailabilityStart"
                    });
                    F.push(n);
                    q[n] = q[n] || [];
                    q[n].push({
                        type: "01-taskAvailailabilityEnd",
                        typeBackward: "00-taskAvailailabilityEnd"
                    })
                }
            }
            for (y = 0; y < v.length; y++) {
                var e = v[y].getAvailabilityIntervalsFor(j);
                for (u = 0; u < e.length; u++) {
                    B = e[u];
                    D = B.startDate - 0;
                    n = B.endDate - 0;
                    if (!q[D]) {
                        q[D] = [];
                        F.push(D)
                    }
                    q[D].push({
                        type: "02-resourceAvailailabilityStart",
                        typeBackward: "03-resourceAvailailabilityStart",
                        assignment: r[y],
                        resourceId: A[y].getInternalId(),
                        units: r[y].getUnits()
                    });
                    if (!q[n]) {
                        q[n] = [];
                        F.push(n)
                    }
                    q[n].push({
                        type: "03-resourceAvailailabilityEnd",
                        typeBackward: "02-resourceAvailailabilityEnd",
                        assignment: r[y],
                        resourceId: A[y].getInternalId(),
                        units: r[y].getUnits()
                    })
                }
            }
            F.sort();
            var x = false;
            var o = {};
            var m = 0;
            var w, s;
            if (p) {
                for (y = 0; y < F.length; y++) {
                    w = q[F[y]];
                    w.sort(function (k, i) {
                        return k.type < i.type
                    });
                    for (u = 0; u < w.length; u++) {
                        s = w[u];
                        if (s.type == "00-taskAvailailabilityStart") {
                            x = true
                        }
                        if (s.type == "01-taskAvailailabilityEnd") {
                            x = false
                        }
                        if (s.type == "02-resourceAvailailabilityStart") {
                            o[s.resourceId] = s;
                            m++
                        }
                        if (s.type == "03-resourceAvailailabilityEnd") {
                            delete o[s.resourceId];
                            m--
                        }
                    }
                    if ((x || !G) && (m || b)) {
                        D = F[y];
                        n = F[y + 1];
                        if (D >= z || n <= d) {
                            continue
                        }
                        if (D < d) {
                            D = d - 0
                        }
                        if (n > z) {
                            n = z - 0
                        }
                        if (h.call(a, D, n, o) === false) {
                            return false
                        }
                    }
                }
            } else {
                for (y = F.length - 1; y >= 0; y--) {
                    w = q[F[y]];
                    w.sort(function (k, i) {
                        return k.typeBackward < i.typeBackward
                    });
                    for (u = 0; u < w.length; u++) {
                        s = w[u];
                        if (s.typeBackward == "00-taskAvailailabilityEnd") {
                            x = true
                        }
                        if (s.typeBackward == "01-taskAvailailabilityStart") {
                            x = false
                        }
                        if (s.typeBackward == "02-resourceAvailailabilityEnd") {
                            o[s.resourceId] = s;
                            m++
                        }
                        if (s.typeBackward == "03-resourceAvailailabilityStart") {
                            delete o[s.resourceId];
                            m--
                        }
                    }
                    if ((x || !G) && (m || b)) {
                        D = F[y - 1];
                        n = F[y];
                        if (D > z || n <= d) {
                            continue
                        }
                        if (D < d) {
                            D = d - 0
                        }
                        if (n > z) {
                            n = z - 0
                        }
                        if (h.call(a, D, n, o) === false) {
                            return false
                        }
                    }
                }
            }
            j = p ? g.getStartOfNextDay(j) : g.getEndOfPreviousDay(j)
        }
    },
    calculateEffortDrivenEndDate: function (a, c, b) {
        var e = this.getProjectCalendar().convertDurationToMs(c, b || this.getEffortUnit());
        var d = new Date(a);
        this.forEachAvailabilityIntervalWithResources({
            startDate: a
        }, function (l, k, j) {
            var m = 0;
            for (var h in j) {
                m += j[h].units
            }
            var g = k - l;
            var f = m * g / 100;
            if (f >= e) {
                d = new Date(l + e / f * g);
                return false
            } else {
                e -= f
            }
        });
        return d
    },
    recalculateParents: function () {
        var h = new Date(9999, 0, 0),
            e = new Date(0),
            m = this.parentNode;
        if (m && m.childNodes.length > 0) {
            var b = 0;
            for (var f = 0, j = m.childNodes.length; f < j; f++) {
                b += m.childNodes[f].getEffort("MILLI")
            }
            if (m.getEffort("MILLI") != b) {
                m.setEffort(this.getProjectCalendar().convertMSDurationToUnit(b, m.getEffortUnit()))
            }
        }
        var n, c;
        if (m && !m.isRoot() && m.childNodes.length > 0) {
            if (!m.isManuallyScheduled()) {
                for (var g = 0, d = m.childNodes.length; g < d; g++) {
                    var a = m.childNodes[g];
                    h = Sch.util.Date.min(h, a.getStartDate() || h);
                    e = Sch.util.Date.max(e, a.getEndDate() || e)
                }
                n = h - new Date(9999, 0, 0) !== 0 && m.getStartDate() - h !== 0;
                c = e - new Date(0) !== 0 && m.getEndDate() - e !== 0;
                if (n && c) {
                    m.setStartEndDate(h, e, false)
                } else {
                    if (n) {
                        m.setStartDate(h, c, false)
                    } else {
                        if (c) {
                            m.setEndDate(e, false, false)
                        }
                    }
                }
            }
            if (!n && !c) {
                m.recalculateParents()
            }
        }
    },
    isMilestone: function () {
        return this.getDuration() === 0
    },
    isBaselineMilestone: function () {
        var b = this.getBaselineStartDate(),
            a = this.getBaselineEndDate();
        if (b && a) {
            return a - b === 0
        }
        return false
    },
    afterEdit: function (b) {
        if (this.stores.length > 0 || !this.normalized) {
            this.callParent(arguments)
        } else {
            var a = this.taskStore || this.getTaskStore(true);
            if (a && !a.isFillingRoot) {
                a.afterEdit(this, b)
            }
            this.callParent(arguments)
        }
    },
    afterCommit: function () {
        this.callParent(arguments);
        if (this.stores.length > 0 || !this.normalized) {
            return
        }
        var a = this.taskStore || this.getTaskStore(true);
        if (a && !a.isFillingRoot) {
            a.afterCommit(this)
        }
    },
    afterReject: function () {
        if (this.stores.length > 0) {
            this.callParent(arguments)
        } else {
            var a = this.getTaskStore(true);
            if (a && !a.isFillingRoot) {
                a.afterReject(this)
            }
            this.callParent(arguments)
        }
    },
    getDurationUnit: function () {
        return this.get(this.durationUnitField) || "d"
    },
    getEffortUnit: function () {
        return this.get(this.effortUnitField) || "d"
    },
    getBaselinePercentDone: function () {
        return this.get(this.baselinePercentDoneField) || 0
    },
    isPersistable: function () {
        var a = this.parentNode;
        return !a.phantom
    },
    getResources: function () {
        var b = this.getAssignmentStore(),
            c = this.getInternalId();
        var a = [];
        if (b) {
            b.each(function (d) {
                if (d.getTaskId() == c) {
                    a.push(d.getResource())
                }
            })
        }
        return a
    },
    getAssignments: function () {
        var b = this.getAssignmentStore(),
            c = this.getInternalId();
        var a = [];
        if (b) {
            b.each(function (d) {
                if (d.getTaskId() == c) {
                    a.push(d)
                }
            })
        }
        return a
    },
    hasAssignments: function () {
        var b = this.getAssignmentStore(),
            c = this.getInternalId();
        var a = false;
        if (b) {
            b.each(function (d) {
                if (d.getTaskId() == c) {
                    a = true;
                    return false
                }
            })
        }
        return a
    },
    getAssignmentFor: function (b) {
        var c = this.getAssignmentStore(),
            e = this.getInternalId(),
            d = b instanceof Gnt.model.Resource ? b.getInternalId() : b;
        var a;
        if (c) {
            c.each(function (f) {
                if (f.getTaskId() == e && f.getResourceId() == d) {
                    a = f;
                    return false
                }
            })
        }
        return a || null
    },
    unassign: function () {
        return this.unAssign.apply(this, arguments)
    },
    unAssign: function (a) {
        var b = this.getAssignmentStore();
        var c = a instanceof Gnt.model.Resource ? a.getInternalId() : a;
        b.removeAt(b.find("ResourceId", c))
    },
    assign: function (e, a) {
        var b = this.getTaskStore(),
            h = this.getInternalId(),
            f = b.getAssignmentStore(),
            d = b.getResourceStore();
        var g = e instanceof Gnt.model.Resource ? e.getInternalId() : e;
        f.each(function (i) {
            if (i.getTaskId() == h && i.getResourceId() == g) {
                throw "Resource can't be assigned twice to the same task"
            }
        });
        if (e instanceof Gnt.model.Resource && d.indexOf(e) == -1) {
            d.add(e)
        }
        var c = new Gnt.model.Assignment({
            TaskId: h,
            ResourceId: g,
            Units: a
        });
        f.add(c);
        return c
    },
    calculateEffort: function (a, c, b) {
        var d = 0;
        this.forEachAvailabilityIntervalWithResources({
            startDate: a,
            endDate: c
        }, function (h, g, f) {
            var j = 0;
            for (var e in f) {
                j += f[e].units
            }
            d += (g - h) * j / 100
        });
        return this.getProjectCalendar().convertMSDurationToUnit(d, b || this.getEffortUnit())
    },
    updateAssignments: function () {
        var b = {};
        var a = this.getStartDate();
        var d = this.getEndDate();
        var c = 0;
        this.forEachAvailabilityIntervalWithResources({
            startDate: a,
            endDate: d
        }, function (h, g, f) {
            for (var i in f) {
                c += g - h
            }
        });
        if (!c) {
            return
        }
        var e = this.getEffort(Sch.util.Date.MILLI);
        Ext.Array.each(this.getAssignments(), function (f) {
            f.setUnits(e / c * 100)
        })
    },
    updateEffortBasedOnDuration: function () {
        this.setEffort(this.calculateEffort(this.getStartDate(), this.getEndDate()))
    },
    updateDurationBasedOnEffort: function () {
        this.setEndDate(this.calculateEffortDrivenEndDate(this.getStartDate(), this.getEffort(), this.getEffortUnit()), false)
    },
    onPotentialEffortChange: function () {
        if (this.getSchedulingMode() === "FixedDuration") {
            this.updateEffortBasedOnDuration()
        }
        if (this.getSchedulingMode() === "DynamicAssignment") {
            this.updateAssignments()
        }
    },
    onAssignmentMutation: function () {
        if (this.getSchedulingMode() === "FixedDuration") {
            this.updateEffortBasedOnDuration()
        }
        if (this.getSchedulingMode() === "EffortDriven") {
            this.updateDurationBasedOnEffort()
        }
    },
    onAssignmentStructureMutation: function () {
        if (this.getSchedulingMode() == "FixedDuration") {
            this.updateEffortBasedOnDuration()
        }
        if (this.getSchedulingMode() === "EffortDriven") {
            this.updateDurationBasedOnEffort()
        }
        if (this.getSchedulingMode() === "DynamicAssignment") {
            this.updateAssignments()
        }
    },
    adjustToCalendar: function () {
        if (this.get("leaf") && !this.isManuallyScheduled()) {
            var a = this.hasIncomingDependencies();
            if (a) {
                this.constrain()
            } else {
                this.setStartDate(this.getStartDate(), true, true)
            }
        }
    },
    isEditable: function (a) {
        if ((a === this.durationField || a === this.endDateField) && this.getSchedulingMode() === "EffortDriven") {
            return false
        }
        if (a === this.effortField && this.getSchedulingMode() === "FixedDuration") {
            return false
        }
        return true
    },
    isDraggable: function () {
        return this.getDraggable()
    },
    isResizable: function () {
        return this.getResizable()
    },
    ensureSingleSyncForMethod: function () {
        return function () {
            var a = this.getTaskStore(true);
            var c;
            if (a && a.autoSync && !a.autoSyncSuspended) {
                c = true;
                a.suspendAutoSync()
            }
            var b = this.callParent(arguments);
            if (c) {
                a.resumeAutoSync();
                a.sync()
            }
            return b
        }
    },
    getId: function () {
        var a = this.data[this.idProperty];
        return a && a !== "root" ? a : null
    }
}, function () {
    Ext.data.NodeInterface.decorate(this);
    var a = ["addPredecessor", "addSubtask", "addSuccessor", "indent", "outdent", "remove", "insertBefore", "appendChild"];
    this.override({
        remove: function () {
            var b = this.parentNode;
            var c = this.callParent(arguments);
            if (b.childNodes.length === 0 && this.getTaskStore().recalculateParents) {
                b.set("leaf", true)
            }
            return c
        },
        insertBefore: function (b) {
            if (this.phantom) {
                this.data[this.phantomIdField] = b.data[this.phantomParentIdField] = this.internalId
            }
            return this.callParent(arguments)
        },
        appendChild: function (b) {
            if (this.phantom) {
                this.data[this.phantomIdField] = b.data[this.phantomParentIdField] = this.internalId
            }
            return this.callParent(arguments)
        }
    });
    Ext.each(a, function (c) {
        var b = {};
        b[c] = this.prototype.ensureSingleSyncForMethod(this.prototype[c]);
        this.override(b)
    }, this)
});
Ext.define("Gnt.data.Calendar", {
    extend: "Ext.data.Store",
    requires: ["Ext.Date", "Gnt.model.CalendarDay", "Sch.model.Range", "Sch.util.Date"],
    model: "Gnt.model.CalendarDay",
    daysPerMonth: 30,
    daysPerWeek: 7,
    hoursPerDay: 24,
    unitsInMs: null,
    defaultNonWorkingTimeCssCls: "gnt-holiday",
    weekendsAreWorkdays: false,
    weekendFirstDay: 6,
    weekendSecondDay: 0,
    holidaysCache: null,
    availabilityIntervalsCache: null,
    weekAvailability: null,
    defaultWeekAvailability: null,
    nonStandardWeeksByStartDate: null,
    nonStandardWeeksStartDates: null,
    calendarId: null,
    parent: null,
    defaultAvailability: ["00:00-24:00"],
    name: null,
    statics: {
        getCalendar: function (a) {
            if (a instanceof Gnt.data.Calendar) {
                return a
            }
            return Ext.data.StoreManager.lookup("GNT_CALENDAR:" + a)
        },
        getAllCalendars: function () {
            var a = [];
            Ext.data.StoreManager.each(function (b) {
                if (b instanceof Gnt.data.Calendar) {
                    a.push(b)
                }
            });
            return a
        }
    },
    constructor: function (a) {
        a = a || {};
        if (a.calendarId) {
            this.storeId = "GNT_CALENDAR:" + a.calendarId
        }
        this.callParent(arguments);
        var c = this;
        var b = this.parent = Gnt.data.Calendar.getCalendar(a.parent);
        if (a.parent && !this.parent) {
            throw new Error("Invalid parent specified for calendar")
        }
        this.unitsInMs = {
            MILLI: 1,
            SECOND: 1000,
            MINUTE: 60 * 1000,
            HOUR: 60 * 60 * 1000,
            DAY: this.hoursPerDay * 60 * 60 * 1000,
            WEEK: this.daysPerWeek * this.hoursPerDay * 60 * 60 * 1000,
            MONTH: this.daysPerMonth * this.hoursPerDay * 60 * 60 * 1000,
            QUARTER: 3 * this.daysPerMonth * 24 * 60 * 60 * 1000,
            YEAR: 4 * 3 * this.daysPerMonth * 24 * 60 * 60 * 1000
        };
        this.defaultWeekAvailability = this.getDefaultWeekAvailability(this.weekendsAreWorkdays);
        Ext.Array.each(a.weekAvailability || [], function (e, d) {
            if (e) {
                e.setDate(new Date(0, 0, d));
                e.set(e.idProperty, "WEEKDAY:" + d)
            }
            c.add(e)
        });
        this.holidaysCache = {};
        this.availabilityIntervalsCache = {};
        this.on({
            clear: this.clearCache,
            datachanged: this.clearCache,
            update: this.clearCache,
            load: this.updateAvailability,
            scope: this
        });
        b && b.on("clearcache", this.clearCache, this);
        this.updateAvailability()
    },
    getDefaultWeekAvailability: function (f) {
        var e = this.defaultAvailability;
        var d = this.weekendFirstDay;
        var a = this.weekendSecondDay;
        var c = [];
        for (var b = 0; b < 7; b++) {
            c.push(f || b != d && b != a ? new Gnt.model.CalendarDay({
                Availability: Ext.Array.clone(e),
                IsWorkingDay: true
            }) : new Gnt.model.CalendarDay({
                Availability: []
            }))
        }
        return c
    },
    updateAvailability: function () {
        var a = this.weekAvailability = [];
        var c = this.nonStandardWeeksStartDates = [];
        var b = this.nonStandardWeeksByStartDate = {};
        this.each(function (e) {
            var i = e.getId();
            var g = /^(\d)-(\d\d\d\d\/\d\d\/\d\d)-(\d\d\d\d\/\d\d\/\d\d)$/.exec(i);
            var f;
            if (g) {
                var d = Ext.Date.parse(g[2], "Y/m/d") - 0;
                var h = Ext.Date.parse(g[3], "Y/m/d") - 0;
                f = g[1];
                if (!b[d]) {
                    b[d] = {
                        startDate: new Date(d),
                        endDate: new Date(h),
                        name: e.getName(),
                        weekAvailability: []
                    };
                    c.push(d)
                }
                b[d].weekAvailability[f] = e
            }
            g = /^WEEKDAY:(\d+)$/.exec(i);
            if (g) {
                f = g[1];
                if (f < 0 || f > 6) {
                    throw new Error("Incorrect week day index")
                }
                a[f] = e
            }
        });
        c.sort()
    },
    intersectsWithCurrentWeeks: function (b, d) {
        var e = this.nonStandardWeeksStartDates;
        var c = this.nonStandardWeeksByStartDate;
        var a = false;
        Ext.Array.each(e, function (h) {
            var f = c[h].startDate;
            var g = c[h].endDate;
            if (f <= b && b < g || f < d && d <= g) {
                a = true;
                return false
            }
        });
        return a
    },
    addNonStandardWeek: function (b, c, a) {
        b = Ext.Date.clearTime(new Date(b));
        c = Ext.Date.clearTime(new Date(c));
        if (this.intersectsWithCurrentWeeks(b, c)) {
            throw new Error("Can not add intersecting week")
        }
        Ext.Array.each(a, function (d, e) {
            if (d) {
                d.set(d.idProperty, e + "-" + Ext.Date.format(b, "Y/m/d") + "-" + Ext.Date.format(c, "Y/m/d"))
            }
        });
        b = b - 0;
        c = c - 0;
        this.nonStandardWeeksStartDates.push(b);
        this.nonStandardWeeksStartDates.sort();
        this.nonStandardWeeksByStartDate[b] = {
            startDate: new Date(b),
            endDate: new Date(c),
            weekAvailability: a
        };
        this.add(Ext.Array.clean(a))
    },
    getNonStandardWeekByStartDate: function (a) {
        return this.nonStandardWeeksByStartDate[Ext.Date.clearTime(new Date(a)) - 0]
    },
    getNonStandardWeekByDate: function (d) {
        d = Ext.Date.clearTime(new Date(d)) - 0;
        var e = this.nonStandardWeeksStartDates;
        var a = this.nonStandardWeeksByStartDate;
        for (var c = 0; c < e.length; c++) {
            var b = a[e[c]];
            if (b.startDate <= d && d <= b.endDate) {
                return b
            }
        }
        return null
    },
    removeNonStandardWeek: function (a) {
        a = Ext.Date.clearTime(new Date(a)) - 0;
        var b = this.getNonStandardWeekByStartDate(a);
        if (!b) {
            return
        }
        this.remove(Ext.Array.clean(b.weekAvailability));
        delete this.nonStandardWeeksByStartDate[a];
        Ext.Array.remove(this.nonStandardWeeksStartDates, a)
    },
    clearCache: function () {
        this.holidaysCache = {};
        this.availabilityIntervalsCache = {};
        this.fireEvent("clearcache", this)
    },
    setWeekendsAreWorkDays: function (a) {
        if (a !== this.weekendsAreWorkdays) {
            this.weekendsAreWorkdays = a;
            this.clearCache();
            this.defaultWeekAvailability = this.getDefaultWeekAvailability(this.weekendsAreWorkdays)
        }
    },
    areWeekendsWorkDays: function () {
        return this.weekendsAreWorkdays
    },
    getCalendarDay: function (b) {
        b = typeof b == "number" ? new Date(b) : b;
        var a = this.getOverrideDay(b);
        if (a) {
            return a
        }
        return this.getDefaultCalendarDay(b.getDay(), b)
    },
    getOverrideDay: function (a) {
        var b = this.getOwnCalendarDay(a);
        if (b) {
            return b
        }
        if (this.parent) {
            return this.parent.getOverrideDay(a)
        }
        return null
    },
    getOwnCalendarDay: function (a) {
        a = typeof a == "number" ? new Date(a) : a;
        return this.getById(Ext.Date.clearTime(a, true) - 0)
    },
    getDefaultCalendarDay: function (c, b) {
        if (b) {
            var a = this.getNonStandardWeekByDate(b);
            if (a && a.weekAvailability[c]) {
                return a.weekAvailability[c]
            }
        }
        if (this.weekAvailability[c]) {
            return this.weekAvailability[c]
        }
        if (this.parent) {
            return this.parent.getDefaultCalendarDay(c)
        }
        return this.defaultWeekAvailability[c]
    },
    isHoliday: function (c) {
        var b = c - 0;
        var d = this.holidaysCache;
        if (d[b] != null) {
            return d[b]
        }
        c = typeof c == "number" ? new Date(c) : c;
        var a = this.getCalendarDay(c);
        if (!a) {
            throw "Can't find day for " + c
        }
        return d[b] = !a.getIsWorkingDay()
    },
    isWeekend: function (b) {
        var a = b.getDay();
        return a === this.weekendFirstDay || a === this.weekendSecondDay
    },
    isWorkingDay: function (a) {
        return !this.isHoliday(a)
    },
    convertMSDurationToUnit: function (a, b) {
        return a / this.unitsInMs[Sch.util.Date.getNameOfUnit(b)]
    },
    convertDurationToMs: function (b, a) {
        return b * this.unitsInMs[Sch.util.Date.getNameOfUnit(a)]
    },
    getHolidaysRanges: function (d, g, a) {
        if (d > g) {
            Ext.Error.raise("startDate can't be bigger than endDate")
        }
        d = Ext.Date.clearTime(d, true);
        g = Ext.Date.clearTime(g, true);
        var c = [],
            h, e;
        for (e = d; e < g; e = Sch.util.Date.add(e, Sch.util.Date.DAY, 1)) {
            if (this.isHoliday(e) || (this.weekendsAreWorkdays && a && this.isWeekend(e))) {
                var i = this.getCalendarDay(e);
                var j = i && i.getCls() || this.defaultNonWorkingTimeCssCls;
                var f = Sch.util.Date.add(e, Sch.util.Date.DAY, 1);
                if (!h) {
                    h = {
                        StartDate: e,
                        EndDate: f,
                        Cls: j
                    }
                } else {
                    if (h.Cls == j) {
                        h.EndDate = f
                    } else {
                        c.push(h);
                        h = {
                            StartDate: e,
                            EndDate: f,
                            Cls: j
                        }
                    }
                }
            } else {
                if (h) {
                    c.push(h);
                    h = null
                }
            }
        }
        if (h) {
            c.push(h)
        }
        var b = [];
        Ext.each(c, function (k) {
            b.push(Ext.create("Sch.model.Range", {
                StartDate: k.StartDate,
                EndDate: k.EndDate,
                Cls: k.Cls
            }))
        });
        return b
    },
    forEachAvailabilityInterval: function (r, f, p) {
        p = p || this;
        var l = this;
        var d = r.startDate;
        var j = r.endDate;
        var o = r.isForward !== false;
        if (o ? !d : !j) {
            throw new Error("At least `startDate` or `endDate` is required, depending from the `isForward` option")
        }
        var a = new Date(o ? d : j);
        var q = o ? !j : !d;
        var c = Sch.util.Date;
        while (q || (o ? a < j : a > d)) {
            var h = this.getAvailabilityIntervalsFor(a - (o ? 0 : 1));
            for (var g = o ? 0 : h.length - 1; o ? g < h.length : g >= 0; o ? g++ : g--) {
                var b = h[g];
                var k = b.startDate;
                var n = b.endDate;
                if (k >= j || n <= d) {
                    continue
                }
                var e = k < d ? d : k;
                var m = n > j ? j : n;
                if (f.call(p, e, m) === false) {
                    return false
                }
            }
            a = o ? c.getStartOfNextDay(a) : c.getEndOfPreviousDay(a)
        }
    },
    calculateDuration: function (a, d, b) {
        var c = 0;
        this.forEachAvailabilityInterval({
            startDate: a,
            endDate: d
        }, function (f, e) {
            c += e - f
        });
        return this.convertMSDurationToUnit(c, b)
    },
    calculateEndDate: function (a, f, b) {
        if (!f) {
            return new Date(a)
        }
        var e = Sch.util.Date,
            d;
        f = this.convertDurationToMs(f, b);
        var c = f === 0 && Ext.Date.clearTime(a, true) - a === 0 ? e.add(a, Sch.util.Date.DAY, - 1) : a;
        this.forEachAvailabilityInterval({
            startDate: c
        }, function (i, h) {
            var j = h - i;
            var g = i.getTimezoneOffset() - h.getTimezoneOffset();
            if (j >= f) {
                d = new Date(i - 0 + f);
                return false
            } else {
                f -= j + g * 60 * 1000
            }
        });
        return d
    },
    calculateStartDate: function (d, c, b) {
        if (!c) {
            return new Date(d)
        }
        var a;
        c = this.convertDurationToMs(c, b);
        this.forEachAvailabilityInterval({
            endDate: d,
            isForward: false
        }, function (f, e) {
            var g = e - f;
            if (g >= c) {
                a = new Date(e - c);
                return false
            } else {
                c -= g
            }
        });
        return a
    },
    skipNonWorkingTime: function (a, b) {
        this.forEachAvailabilityInterval(b ? {
            startDate: a
        } : {
            endDate: a,
            isForward: false
        }, function (d, c) {
            a = b ? d : c;
            return false
        });
        return new Date(a)
    },
    skipWorkingDays: function (a, b) {
        var c = 0,
            d = b > 0,
            e = Sch.util.Date,
            f = Ext.Date.clone(a);
        b = Math.abs(b);
        while (c < b) {
            if (!this.isHoliday(f - (d ? 0 : 1))) {
                c++;
                if (d) {
                    f = e.getStartOfNextDay(f, true)
                } else {
                    f = e.getEndOfPreviousDay(f)
                }
            }
            if (d || c < b) {
                f = this.skipNonWorkingTime(f, d)
            }
        }
        e.copyTimeValues(f, a);
        return f
    },
    getAvailabilityIntervalsFor: function (a) {
        a = Ext.Date.clearTime(new Date(a)) - 0;
        if (this.availabilityIntervalsCache[a]) {
            return this.availabilityIntervalsCache[a]
        }
        return this.availabilityIntervalsCache[a] = this.getCalendarDay(a).getAvailabilityIntervalsFor(a)
    },
    getParentableCalendars: function () {
        var c = this,
            a = [],
            d = Gnt.data.Calendar.getAllCalendars();
        var b = function (e) {
            if (!e.parent) {
                return false
            }
            if (e.parent == c) {
                return true
            }
            return b(e.parent)
        };
        Ext.Array.each(d, function (e) {
            if (e === c) {
                return
            }
            if (!b(e)) {
                a.push({
                    Id: e.calendarId,
                    Name: e.name || e.calendarId
                })
            }
        });
        return a
    }
});
Ext.define("Gnt.data.calendar.BusinessTime", {
    extend: "Gnt.data.Calendar",
    daysPerMonth: 20,
    daysPerWeek: 5,
    hoursPerDay: 8,
    defaultAvailability: ["08:00-12:00", "13:00-17:00"]
});
Ext.define("Gnt.data.TaskStore", {
    extend: "Ext.data.TreeStore",
    requires: ["Sch.patches.TreeStore", "Gnt.model.Task", "Gnt.data.Calendar"],
    model: "Gnt.model.Task",
    calendar: null,
    dependencyStore: null,
    resourceStore: null,
    assignmentStore: null,
    weekendsAreWorkdays: false,
    buffered: false,
    pageSize: null,
    cascadeChanges: false,
    batchSync: true,
    recalculateParents: true,
    skipWeekendsDuringDragDrop: true,
    cascadeDelay: 0,
    cascading: false,
    isFillingRoot: false,
    constructor: function (c) {
        this.addEvents("root-fill-start", "root-fill-end", "filter", "clearfilter", "beforecascade", "cascade");
        c = c || {};
        if (!c.calendar) {
            var a = {};
            if (c.hasOwnProperty("weekendsAreWorkdays")) {
                a.weekendsAreWorkdays = c.weekendsAreWorkdays
            } else {
                if (this.self.prototype.hasOwnProperty("weekendsAreWorkdays") && this.self != Gnt.data.TaskStore) {
                    a.weekendsAreWorkdays = this.weekendsAreWorkdays
                }
            }
            c.calendar = new Gnt.data.Calendar(a)
        }
        this.hasListeners = {};
        this.on({
            "root-fill-end": this.onRootFillEnd,
            remove: this.onTaskDeleted,
            beforesync: this.onTaskStoreBeforeSync,
            write: this.onTaskStoreWrite,
            scope: this
        });
        var b = c.dependencyStore;
        if (b) {
            delete c.dependencyStore;
            this.setDependencyStore(b)
        }
        var d = c.resourceStore;
        if (d) {
            delete c.resourceStore;
            this.setResourceStore(d)
        }
        var f = c.assignmentStore;
        if (f) {
            delete c.assignmentStore;
            this.setAssignmentStore(f)
        }
        var e = c.calendar;
        if (e) {
            delete c.calendar;
            this.setCalendar(e)
        }
        this.callParent([c]);
        if (Ext.data.reader.Xml && this.getProxy().getReader() instanceof Ext.data.reader.Xml) {
            Ext.override(this.getProxy().getReader(), {
                extractData: function (g) {
                    var h = this.record;
                    if (h != g.nodeName) {
                        g = Ext.DomQuery.select(">" + h, g)
                    } else {
                        g = [g]
                    }
                    return Ext.data.reader.Xml.superclass.extractData.apply(this, [g])
                }
            })
        }
        if (this.autoSync && this.batchSync) {
            this.sync = Ext.Function.createBuffered(this.sync, 500)
        }
    },
    loadData: function (A, v) {
        var y = this,
            r = y.getRootNode(),
            c = v ? v.addRecords : false;
        if (!A.length) {
            return
        } else {
            if (!r) {
                r = y.setRootNode()
            }
            y.suspendAutoSync();
            y.suspendEvents();
            if (!c) {
                r.removeAll()
            }
            var f = A.length,
                e = y.model,
                m = [],
                t = (typeof A[0].get === "function"),
                b, p, o, w, x, z, u, n, h;
            for (var s = 0; s < f; s++) {
                p = y.getById(A[s].getId ? A[s].getId() : A[s].Id);
                b = 0;
                if (p) {
                    w = t ? A[s].get("parentId") : A[s].parentId;
                    x = p.get("parentId");
                    z = t ? A[s].get("index") : A[s].index;
                    u = p.get("index");
                    if (t) {
                        p.set(A[s].data)
                    } else {
                        p.set(A[s])
                    }
                    if (((w || w === null) ? (w !== x) : false) || (z ? (z !== u) : false)) {
                        n = w === null ? r : y.getById(w);
                        h = x === null ? r : y.getById(x)
                    } else {
                        b = 1
                    }
                } else {
                    p = t ? new e(A[s].data) : new e(A[s]);
                    x = p.get("parentId");
                    if (x) {
                        n = y.getById(x)
                    } else {
                        if (x === null) {
                            n = r
                        }
                    }
                }
                if (n && !b) {
                    y.moveChildren(p, n, h)
                } else {
                    if (typeof n === "undefined" && !b) {
                        o = {
                            node: p,
                            index: p.get("index") || 0,
                            parentId: p.get("parentId")
                        };
                        m.push(o)
                    }
                }
            }
            var g = 0,
                j = m.length,
                d, k;
            while (m.length) {
                if (g > m.length - 1) {
                    g = 0
                }
                d = m[g];
                k = d.parentId === null ? r : y.getById(d.parentId);
                if (k) {
                    var a = y.nodeIsChild(d.node, n);
                    if (a) {
                        k.insertChild(d.index, d.node);
                        y.fixNodeDates(d.node);
                        m.splice(g, 1)
                    }
                }
                g += 1;
                if (g === j - 1 && m.length === j) {
                    throw "Invalid data, possible infinite loop."
                }
            }
            if (y.nodesToExpand) {
                s = 0;
                for (var q = y.nodesToExpand.length; s < q; s += 1) {
                    p = y.nodesToExpand[s];
                    if (p.childNodes.length) {
                        p.expand()
                    }
                }
                delete y.nodesToExpand
            }
            this.fireEvent("datachanged");
            this.fireEvent("refresh");
            y.resumeAutoSync();
            y.resumeEvents();
            if (y.autoSync) {
                y.sync()
            }
        }
    },
    fixNodeDates: function (b) {
        var c = b.calculateDuration(b.getStartDate(), b.getEndDate(), b.getDurationUnit()),
            a;
        b.set({
            Duration: c
        });
        if (b.childNodes.length) {
            a = b.getChildAt(0);
            a.recalculateParents()
        } else {
            b.recalculateParents()
        }
    },
    nodeIsChild: function (c, b) {
        var d = b.getId(),
            a = true;
        if (c.childNodes.length) {
            c.cascadeBy(function (e) {
                if (e.getId() === d) {
                    a = false;
                    return false
                }
            })
        }
        return a
    },
    moveChildren: function (e, d, c) {
        if (e.get("expanded")) {
            if (!this.nodesToExpand) {
                this.nodesToExpand = []
            }
            this.nodesToExpand.push(e);
            e.set("expanded", false)
        }
        var b, f = this.nodeIsChild(e, d),
            a = c || this.getById(e.get("parentId"));
        if (f) {
            if (e.childNodes.length) {
                b = e.copy(null, true);
                e.removeAll()
            }
            if (a && a.getId() !== d.getId()) {
                a.removeChild(e)
            }
            d.insertChild((e.get("index") || 0), e);
            if (b) {
                b.cascadeBy(function (h) {
                    if (h !== b) {
                        var g = h.copy(null);
                        e.insertChild((g.get("index") || 0), g)
                    }
                })
            }
            this.fixNodeDates(e)
        }
    },
    onNodeAdded: function (c, e) {
        if (!e.normalized && !e.isRoot()) {
            e.normalize()
        }
        if (Ext.isIE) {
            var d = this,
                b = d.getProxy(),
                a = b.getReader(),
                f = e.raw || e[e.persistenceProperty],
                g;
            Ext.Array.remove(d.removed, e);
            if (!e.isLeaf()) {
                g = a.getRoot(f);
                if (g) {
                    d.fillNode(e, a.extractData(g));
                    if (f[a.root]) {
                        delete f[a.root]
                    }
                }
            }
            if (d.autoSync && !d.autoSyncSuspended && (e.phantom || e.dirty)) {
                d.sync()
            }
        } else {
            this.callParent(arguments)
        }
    },
    setRootNode: function () {
        var b = this;
        this.tree.setRootNode = Ext.Function.createInterceptor(this.tree.setRootNode, function (c) {
            Ext.apply(c, {
                calendar: b.calendar,
                taskStore: b,
                dependencyStore: b.dependencyStore,
                phantom: false,
                dirty: false
            })
        });
        var a = this.callParent(arguments);
        delete this.tree.setRootNode;
        return a
    },
    fillNode: function (g, c) {
        this.isFillingNode = true;
        if (g.isRoot()) {
            this.isFillingRoot = true;
            this.un({
                remove: this.onNodeUpdated,
                append: this.onNodeUpdated,
                insert: this.onNodeUpdated,
                update: this.onTaskUpdated,
                scope: this
            });
            this.fireEvent("root-fill-start", this, g, c)
        }
        var f = this,
            e = c ? c.length : 0,
            d = 0,
            b;
        if (e && f.sortOnLoad && !f.remoteSort && f.sorters && f.sorters.items) {
            b = Ext.create("Ext.util.MixedCollection");
            b.addAll(c);
            b.sort(f.sorters.items);
            c = b.items
        }
        g.set("loaded", true);
        if (this.buffered) {
            for (; d < e; d++) {
                var a = c[d];
                a.__isFilling__ = true;
                g.appendChild(a, true, true);
                this.onNodeAdded(null, a);
                this.tree.registerNode(a)
            }
        } else {
            for (; d < e; d++) {
                c[d].__isFilling__ = true;
                g.appendChild(c[d], false, true)
            }
        }
        if (g.isRoot()) {
            this.getRootNode().cascadeBy(function (h) {
                delete h.__isFilling__
            });
            this.isFillingRoot = false;
            this.on({
                remove: this.onNodeUpdated,
                append: this.onNodeUpdated,
                insert: this.onNodeUpdated,
                update: this.onTaskUpdated,
                scope: this
            });
            this.fireEvent("root-fill-end", this, g, c)
        }
        delete this.isFillingNode;
        return c
    },
    onRootFillEnd: function (b, a) {
        a.normalizeEffort()
    },
    getById: function (a) {
        return this.tree.getNodeById(a)
    },
    setDependencyStore: function (a) {
        if (this.dependencyStore) {
            this.dependencyStore.un({
                add: this.onDependencyAddOrUpdate,
                update: this.onDependencyAddOrUpdate,
                beforesync: this.onBeforeDependencySync,
                scope: this
            })
        }
        this.dependencyStore = Ext.StoreMgr.lookup(a);
        if (a) {
            a.taskStore = this;
            a.on({
                add: this.onDependencyAddOrUpdate,
                update: this.onDependencyAddOrUpdate,
                scope: this
            })
        }
    },
    setResourceStore: function (a) {
        this.resourceStore = Ext.StoreMgr.lookup(a);
        a.taskStore = this
    },
    getResourceStore: function () {
        return this.resourceStore || null
    },
    setAssignmentStore: function (a) {
        if (this.assignmentStore) {
            this.assignmentStore.un({
                add: this.onAssignmentStructureMutation,
                update: this.onAssignmentMutation,
                remove: this.onAssignmentStructureMutation,
                scope: this
            })
        }
        this.assignmentStore = Ext.StoreMgr.lookup(a);
        a.taskStore = this;
        a.on({
            add: this.onAssignmentStructureMutation,
            update: this.onAssignmentMutation,
            remove: this.onAssignmentStructureMutation,
            scope: this
        })
    },
    getAssignmentStore: function () {
        return this.assignmentStore || null
    },
    renormalizeTasks: function (b, a) {
        if (a instanceof Gnt.model.Task) {
            a.adjustToCalendar()
        } else {
            this.getRootNode().cascadeBy(function (c) {
                c.adjustToCalendar()
            })
        }
    },
    getCalendar: function () {
        return this.calendar || null
    },
    setCalendar: function (c) {
        var b = {
            datachanged: this.renormalizeTasks,
            update: this.renormalizeTasks,
            clear: this.renormalizeTasks,
            scope: this
        };
        if (this.calendar) {
            this.calendar.un(b)
        }
        this.calendar = c;
        c.on(b);
        var a = this.tree && this.getRootNode();
        if (a) {
            a.calendar = c
        }
    },
    filter: function () {
        this.fireEvent("filter", this, arguments)
    },
    clearFilter: function () {
        this.fireEvent("clearfilter", this)
    },
    getCriticalPaths: function () {
        var b = this.getRootNode(),
            a = [],
            d = new Date(0);
        b.cascadeBy(function (e) {
            d = Sch.util.Date.max(e.getEndDate(), d)
        });
        b.cascadeBy(function (e) {
            if (d - e.getEndDate() === 0 && !e.isRoot()) {
                a.push(e)
            }
        });
        var c = [];
        Ext.each(a, function (e) {
            c.push(e.getCriticalPaths())
        });
        return c
    },
    onNodeUpdated: function (a, b) {
        if (!this.cascading && this.recalculateParents && !this.isFillingNode) {
            b.recalculateParents()
        }
    },
    onTaskUpdated: function (c, b, a) {
        var d = b.previous;
        if (!this.cascading && !this.isFillingNode && a !== Ext.data.Model.COMMIT && (d && (b.startDateField in d || b.endDateField in d || "parentId" in d || b.effortField in d))) {
            if (this.cascadeChanges) {
                Ext.Function.defer(this.cascadeChangesForTask, this.cascadeDelay, this, [b])
            }
            if (this.recalculateParents) {
                b.recalculateParents()
            }
        }
    },
    cascadeChangesForTask: function (a) {
        var c = this,
            b = {
                nbrAffected: 0
            };
        Ext.each(a.getOutgoingDependencies(), function (d) {
            var e = d.getTargetTask();
            if (e) {
                if (!c.cascading) {
                    c.fireEvent("beforecascade", c)
                }
                c.cascading = true;
                e.cascadeChanges(c, b)
            }
        });
        if (c.cascading) {
            c.cascading = false;
            c.fireEvent("cascade", c, b)
        }
    },
    onTaskDeleted: function (c, b) {
        var a = this.dependencyStore;
        if (a && !b.isReplace && !b.isMove) {
            a.remove(b.getAllDependencies(a))
        }
    },
    onAssignmentMutation: function (c, a) {
        var b = this;
        Ext.each(a, function (e) {
            var d = e.getTask(b);
            if (d) {
                d.onAssignmentMutation(e)
            }
        })
    },
    onAssignmentStructureMutation: function (c, a) {
        var b = this;
        Ext.each(a, function (d) {
            d.getTask(b).onAssignmentStructureMutation(d)
        })
    },
    onDependencyAddOrUpdate: function (b, d) {
        if (this.cascadeChanges) {
            var c = this,
                a;
            Ext.each(d, function (e) {
                a = e.getTargetTask();
                if (a) {
                    a.constrain(c)
                }
            })
        }
    },
    getNewRecords: function () {
        return Ext.Array.filter(this.tree.flatten(), this.filterNew, this)
    },
    getUpdatedRecords: function () {
        return Ext.Array.filter(this.tree.flatten(), this.filterUpdated, this)
    },
    filterNew: function (a) {
        return a.phantom === true && a.isValid() && a != this.tree.root
    },
    filterUpdated: function (a) {
        return a.dirty === true && a.phantom !== true && a.isValid() && a != this.tree.root
    },
    onTaskStoreBeforeSync: function (b, c) {
        var a = b.create;
        if (a) {
            for (var e, d = a.length - 1; d >= 0; d--) {
                e = a[d];
                if (e.isPersistable()) {
                    e._phantomId = e.internalId
                } else {
                    if (this.autoSync) {
                        Ext.Array.remove(a, e)
                    }
                }
            }
            if (a.length === 0) {
                delete b.create
            }
        }
        return Boolean((b.create && b.create.length > 0) || (b.update && b.update.length > 0) || (b.destroy && b.destroy.length > 0))
    },
    onTaskStoreWrite: function (c, b) {
        var d = this.dependencyStore;
        if (!d || b.action !== "create") {
            return
        }
        var a = b.getRecords(),
            e;
        Ext.each(a, function (f) {
            e = f.getId();
            if (!f.phantom && e !== f._phantomId) {
                Ext.each(d.getNewRecords(), function (g) {
                    var i = g.getSourceId();
                    var h = g.getTargetId();
                    if (i === f._phantomId) {
                        g.setSourceId(e)
                    } else {
                        if (h === f._phantomId) {
                            g.setTargetId(e)
                        }
                    }
                });
                Ext.each(f.childNodes, function (g) {
                    if (g.phantom) {
                        g.set("parentId", e)
                    }
                });
                delete f._phantomId
            }
        })
    },
    getTotalTimeSpan: function () {
        var a = new Date(9999, 0, 1),
            b = new Date(0),
            c = Sch.util.Date;
        this.getRootNode().cascadeBy(function (d) {
            if (d.getStartDate()) {
                a = c.min(d.getStartDate(), a)
            }
            if (d.getEndDate()) {
                b = c.max(d.getEndDate(), b)
            }
        });
        a = a < new Date(9999, 0, 1) ? a : null;
        b = b > new Date(0) ? b : null;
        return {
            start: a,
            end: b || a || null
        }
    },
    getCount: function (b) {
        var a = b === false ? 0 : -1;
        this.getRootNode().cascadeBy(function () {
            a++
        });
        return a
    },
    toArray: function () {
        var a = [];
        this.getRootNode().cascadeBy(function (b) {
            a.push(b)
        });
        return a
    },
    remove: function (a) {
        Ext.each(a, function (b) {
            b.remove()
        })
    },
    indent: function (b) {
        b = Ext.isArray(b) ? b : [b];
        var a = Ext.Array.sort(b, function (d, c) {
            return d.data.index > c.data.index
        });
        Ext.each(a, function (c) {
            c.indent()
        })
    },
    outdent: function (b) {
        var a = Ext.Array.sort(b, function (d, c) {
            return d.data.index > c.data.index
        });
        Ext.each(a, function (c) {
            c.indent()
        });
        Ext.each(b, function (c) {
            c.outdent()
        })
    },
    getTasksForResource: function (a) {
        return a.getTasks()
    },
    getEventsForResource: function (a) {
        return this.getTasksForResource(a)
    },
    ensureSingleSyncForMethod: function () {
        return function () {
            var b;
            if (this.autoSync && !this.autoSyncSuspended) {
                b = true;
                this.suspendAutoSync()
            }
            var a = this.callParent(arguments);
            if (b) {
                this.resumeAutoSync();
                this.sync()
            }
            return a
        }
    }
}, function () {
    var a = ["indent", "outdent", "afterEdit", "remove"];
    Ext.each(a, function (c) {
        var b = {};
        b[c] = this.prototype.ensureSingleSyncForMethod(this.prototype[c]);
        this.override(b)
    }, this)
});
Ext.define("Gnt.data.DependencyStore", {
    extend: "Ext.data.Store",
    model: "Gnt.model.Dependency",
    constructor: function () {
        this.callParent(arguments);
        this.init()
    },
    init: function () {
        this.on({
            beforesync: this.onBeforeSyncOperation,
            scope: this
        })
    },
    onBeforeSyncOperation: function (a, b) {
        if (a.create) {
            for (var d, c = a.create.length - 1; c >= 0; c--) {
                d = a.create[c];
                if (!d.isPersistable()) {
                    Ext.Array.remove(a.create, d)
                }
            }
            if (a.create.length === 0) {
                delete a.create
            }
        }
        return Boolean((a.create && a.create.length > 0) || (a.update && a.update.length > 0) || (a.destroy && a.destroy.length > 0))
    },
    getDependenciesForTask: function (b) {
        var g = b.getId() || b.internalId;
        var e = [],
            f = this;
        for (var d = 0, a = f.getCount(); d < a; d++) {
            var c = f.getAt(d);
            if (c.getSourceId() == g || c.getTargetId() == g) {
                e.push(c)
            }
        }
        return e
    },
    getIncomingDependenciesForTask: function (b) {
        var g = b.getId() || b.internalId;
        var e = [],
            f = this;
        for (var d = 0, a = f.getCount(); d < a; d++) {
            var c = f.getAt(d);
            if (c.getTargetId() == g) {
                e.push(c)
            }
        }
        return e
    },
    getOutgoingDependenciesForTask: function (b) {
        var g = b.getId() || b.internalId;
        var e = [],
            f = this;
        for (var d = 0, a = f.getCount(); d < a; d++) {
            var c = f.getAt(d);
            if (c.getSourceId() == g) {
                e.push(c)
            }
        }
        return e
    },
    hasTransitiveDependency: function (d, b, a) {
        var c = this;
        return this.findBy(function (f) {
            var e = f.getTargetId();
            if (f.getSourceId() === d) {
                return (e === b && f !== a) ? true : c.hasTransitiveDependency(f.getTargetId(), b, a)
            }
        }) >= 0
    },
    isValidDependency: function (h, b, e) {
        var f = true;
        var d, c, a;
        if (h instanceof Gnt.model.Dependency) {
            d = h.getSourceId();
            c = this.getSourceTask(d);
            b = h.getTargetId();
            a = this.getTargetTask(b)
        } else {
            d = h;
            c = this.getSourceTask(d);
            a = this.getTargetTask(b)
        }
        if (!e && h instanceof Gnt.model.Dependency) {
            f = h.isValid()
        } else {
            f = d && b && d !== b
        }
        if (f) {
            if (c && a && (c.contains(a) || a.contains(c))) {
                f = false
            }
            var g = e || (h instanceof Gnt.model.Dependency);
            if (f && ((!g && this.areTasksLinked(d, b)) || this.hasTransitiveDependency(b, d, g ? h : null))) {
                f = false
            }
        }
        return f
    },
    areTasksLinked: function (a, c) {
        var b = this;
        a = a instanceof Gnt.model.Task ? (a.getId() || a.internalId) : a;
        c = c instanceof Gnt.model.Task ? (c.getId() || c.internalId) : c;
        return this.findBy(function (f) {
            var d = f.getTargetId(),
                e = f.getSourceId();
            if ((e === a && d === c) || (e === c && d === c)) {
                return true
            }
        }) >= 0
    },
    getSourceTask: function (a) {
        var b = a instanceof Gnt.model.Dependency ? dependency.getSourceId() : a;
        return this.getTaskStore().getById(b)
    },
    getTargetTask: function (a) {
        var b = a instanceof Gnt.model.Dependency ? dependency.getSourceId() : a;
        return this.getTaskStore().getById(b)
    },
    getTaskStore: function () {
        return this.taskStore
    }
});
Ext.define("Gnt.data.ResourceStore", {
    requires: ["Gnt.model.Resource"],
    extend: "Sch.data.ResourceStore",
    model: "Gnt.model.Resource",
    taskStore: null,
    getTaskStore: function () {
        return this.taskStore || null
    },
    getAssignmentStore: function () {
        return this.assignmentStore || null
    },
    getByInternalId: function (a) {
        return this.data.getByKey(a) || this.getById(a)
    }
});
Ext.define("Gnt.data.AssignmentStore", {
    requires: ["Gnt.model.Assignment"],
    extend: "Ext.data.Store",
    model: "Gnt.model.Assignment",
    taskStore: null,
    getTaskStore: function () {
        return this.taskStore
    },
    getResourceStore: function () {
        return this.getTaskStore().resourceStore
    },
    getByInternalId: function (a) {
        return this.data.getByKey(a) || this.getById(a)
    }
});
Ext.define("Gnt.template.Task", {
    extend: "Ext.XTemplate",
    constructor: function (a) {
        this.callParent(['<div class="sch-event-wrap ' + a.baseCls + ' x-unselectable" style="left:{leftOffset}px;">' + (a.leftLabel ? '<div class="sch-gantt-labelct sch-gantt-labelct-left"><label class="sch-gantt-label sch-gantt-label-left">{leftLabel}</label></div>' : "") + '<div id="' + a.prefix + '{id}" class="sch-gantt-item sch-gantt-task-bar {cls}" unselectable="on" style="width:{width}px;{style}">' + (a.enableDependencyDragDrop ? '<div unselectable="on" class="sch-gantt-terminal sch-gantt-terminal-start"></div>' : "") + ((a.resizeHandles === "both" || a.resizeHandles === "left") ? '<div class="sch-resizable-handle sch-gantt-task-handle sch-resizable-handle-west"></div>' : "") + '<div class="sch-gantt-progress-bar" style="width:{percentDone}%;{progressBarStyle}" unselectable="on">&#160;</div>' + ((a.resizeHandles === "both" || a.resizeHandles === "right") ? '<div class="sch-resizable-handle sch-gantt-task-handle sch-resizable-handle-east"></div>' : "") + (a.enableDependencyDragDrop ? '<div unselectable="on" class="sch-gantt-terminal sch-gantt-terminal-end"></div>' : "") + (a.enableProgressBarResize ? '<div style="left:{percentDone}%" class="sch-gantt-progressbar-handle"></div>' : "") + "</div>" + (a.rightLabel ? '<div class="sch-gantt-labelct sch-gantt-labelct-right" style="left:{width}px"><label class="sch-gantt-label sch-gantt-label-right">{rightLabel}</label></div>' : "") + "</div>", {
            compiled: true,
            disableFormats: true
        }])
    }
});
Ext.define("Gnt.template.Milestone", {
    extend: "Ext.XTemplate",
    constructor: function (a) {
        this.callParent(['<div class="sch-event-wrap ' + a.baseCls + ' x-unselectable" style="left:{leftOffset}px">' + (a.leftLabel ? '<div class="sch-gantt-labelct sch-gantt-labelct-left"><label class="sch-gantt-label sch-gantt-label-left">{leftLabel}</label></div>' : "") + (a.printable ? ('<img id="' + a.prefix + '{id}" src="' + a.imgSrc + '" class="sch-gantt-item sch-gantt-milestone-diamond {cls}" unselectable="on" style="{style}" />') : ('<div id="' + a.prefix + '{id}" class="sch-gantt-item sch-gantt-milestone-diamond {cls}" unselectable="on" style="{style}">' + (a.enableDependencyDragDrop ? '<div class="sch-gantt-terminal sch-gantt-terminal-start"></div><div class="sch-gantt-terminal sch-gantt-terminal-end"></div>' : "") + "</div>")) + (a.rightLabel ? '<div class="sch-gantt-labelct sch-gantt-labelct-right" style="left:{width}px"><label class="sch-gantt-label sch-gantt-label-right">{rightLabel}</label></div>' : "") + "</div>", {
            compiled: true,
            disableFormats: true
        }])
    }
});
Ext.define("Gnt.template.ParentTask", {
    extend: "Ext.XTemplate",
    constructor: function (a) {
        this.callParent(['<div class="sch-event-wrap ' + a.baseCls + ' x-unselectable" style="left:{leftOffset}px;">' + (a.leftLabel ? '<div class="sch-gantt-labelct sch-gantt-labelct-left"><label class="sch-gantt-label sch-gantt-label-left">{leftLabel}</label></div>' : "") + '<div id="' + a.prefix + '{id}" class="sch-gantt-item sch-gantt-parenttask-bar {cls}" style="width:{width}px; {style}"><div class="sch-gantt-progress-bar" style="width:{percentDone}%;{progressBarStyle}">&#160;</div>' + (a.enableDependencyDragDrop ? '<div class="sch-gantt-terminal sch-gantt-terminal-start"></div>' : "") + '<div class="sch-gantt-parenttask-arrow sch-gantt-parenttask-leftarrow"></div><div class="sch-gantt-parenttask-arrow sch-gantt-parenttask-rightarrow"></div>' + (a.enableDependencyDragDrop ? '<div class="sch-gantt-terminal sch-gantt-terminal-end"></div>' : "") + "</div>" + (a.rightLabel ? '<div class="sch-gantt-labelct sch-gantt-labelct-right" style="left:{width}px"><label class="sch-gantt-label sch-gantt-label-right">{rightLabel}</label></div>' : "") + "</div>", {
            compiled: true,
            disableFormats: true
        }])
    }
});
Ext.define("Gnt.Tooltip", {
    extend: "Ext.ToolTip",
    requires: ["Ext.Template"],
    startText: "Starts: ",
    endText: "Ends: ",
    durationText: "Duration:",
    mode: "startend",
    cls: "sch-tip",
    height: 40,
    autoHide: false,
    anchor: "b-tl",
    maskOnDisable: false,
    initComponent: function () {
        if (this.mode === "startend" && !this.startEndTemplate) {
            this.startEndTemplate = new Ext.Template('<div class="sch-timetipwrap {cls}"><div>' + this.startText + "{startText}</div><div>" + this.endText + "{endText}</div></div>").compile()
        }
        if (this.mode === "duration" && !this.durationTemplate) {
            this.durationTemplate = new Ext.Template('<div class="sch-timetipwrap {cls}">', "<div>" + this.startText + " {startText}</div>", "<div>" + this.durationText + " {duration} {unit}</div>", "</div>").compile()
        }
        this.callParent(arguments)
    },
    update: function (e, b, d, a) {
        var c;
        if (this.mode === "duration") {
            c = this.getDurationContent(e, b, d, a)
        } else {
            c = this.getStartEndContent(e, b, d, a)
        }
        this.callParent([c])
    },
    getStartEndContent: function (b, f, a, h) {
        var e = this.gantt,
            i = e.getFormattedDate(b),
            d = i,
            g;
        if (f - b > 0) {
            d = e.getFormattedEndDate(f, b)
        }
        var c = {
            cls: a ? "sch-tip-ok" : "sch-tip-notok",
            startText: i,
            endText: d
        };
        if (this.showClock) {
            Ext.apply(c, {
                startHourDegrees: roundedStart.getHours() * 30,
                startMinuteDegrees: roundedStart.getMinutes() * 6
            });
            if (f) {
                Ext.apply(c, {
                    endHourDegrees: g.getHours() * 30,
                    endMinuteDegrees: g.getMinutes() * 6
                })
            }
        }
        return this.startEndTemplate.apply(c)
    },
    getDurationContent: function (f, b, d, a) {
        var c = a.getDurationUnit() || Sch.util.Date.DAY;
        var e = a.calculateDuration(f, b, c);
        return this.durationTemplate.apply({
            cls: d ? "sch-tip-ok" : "sch-tip-notok",
            startText: this.gantt.getFormattedDate(f),
            duration: parseFloat(Ext.Number.toFixed(e, 1)),
            unit: Sch.util.Date.getReadableNameOfUnit(c, e > 1)
        })
    },
    show: function (a) {
        if (a) {
            this.setTarget(a)
        }
        this.callParent([])
    }
});
Ext.define("Gnt.feature.TaskDragDrop", {
    extend: "Ext.dd.DragZone",
    requires: ["Gnt.Tooltip", "Ext.dd.StatusProxy", "Ext.dd.ScrollManager"],
    onDragEnter: Ext.emptyFn,
    onDragOut: Ext.emptyFn,
    constructor: function (a) {
        a = a || {};
        Ext.apply(this, a);
        this.proxy = this.proxy || Ext.create("Ext.dd.StatusProxy", {
            shadow: false,
            dropAllowed: "sch-gantt-dragproxy",
            dropNotAllowed: "sch-gantt-dragproxy",
            ensureAttachedToBody: Ext.emptyFn
        });
        var c = this,
            b = c.gantt;
        if (c.useTooltip) {
            c.tip = Ext.create("Gnt.Tooltip", {
                gantt: b
            })
        }
        c.callParent([b.el, Ext.apply(a, {
            ddGroup: c.gantt.id + "-task-dd"
        })]);
        c.scroll = false;
        c.isTarget = true;
        c.ignoreSelf = false;
        c.addInvalidHandleClass("sch-resizable-handle");
        c.addInvalidHandleClass("x-resizable-handle");
        c.addInvalidHandleClass("sch-gantt-terminal");
        c.addInvalidHandleClass("sch-gantt-progressbar-handle");
        Ext.dd.ScrollManager.register(c.gantt.el);
        c.gantt.ownerCt.el.appendChild(this.proxy.el);
        c.gantt.on({
            destroy: c.cleanUp,
            scope: c
        })
    },
    useTooltip: true,
    validatorFn: function (a, b, d, c) {
        return true
    },
    validatorFnScope: null,
    cleanUp: function () {
        if (this.tip) {
            this.tip.destroy()
        }
        this.destroy()
    },
    containerScroll: false,
    dropAllowed: "sch-gantt-dragproxy",
    dropNotAllowed: "sch-gantt-dragproxy",
    destroy: function () {
        this.callParent(arguments);
        Ext.dd.ScrollManager.unregister(this.gantt.el)
    },
    autoOffset: function (a, e) {
        var d = this.dragData.repairXY,
            c = a - d[0],
            b = e - d[1];
        this.setDelta(c, b)
    },
    setXConstraint: function (c, b, a) {
        this.leftConstraint = c;
        this.rightConstraint = b;
        this.minX = c;
        this.maxX = b;
        if (a) {
            this.setXTicks(this.initPageX, a)
        }
        this.constrainX = true
    },
    setYConstraint: function (a, c, b) {
        this.topConstraint = a;
        this.bottomConstraint = c;
        this.minY = a;
        this.maxY = c;
        if (b) {
            this.setYTicks(this.initPageY, b)
        }
        this.constrainY = true
    },
    constrainTo: function (a, b) {
        this.resetConstraints();
        this.initPageX = a.left;
        this.initPageY = b.top;
        this.setXConstraint(a.left, a.right - (b.right - b.left), this.xTickSize);
        this.setYConstraint(b.top - 1, b.top - 1, this.yTickSize)
    },
    onDragOver: function (g, h) {
        var f = this.dragData,
            d = f.record,
            c = this.gantt,
            b = this.proxy.el.getX() + c.getXOffset(d),
            a = c.getDateFromXY([b, 0], "round");
        if (!f.hidden) {
            Ext.fly(f.sourceNode).hide();
            f.hidden = true
        }
        if (!a || a - f.start === 0) {
            return
        }
        f.start = a;
        this.valid = this.validatorFn.call(this.validatorFnScope || c, d, a, f.duration, g) !== false;
        if (this.tip) {
            this.tip.update(a, d.calculateEndDate(a, d.getDuration(), d.getDurationUnit()), this.valid)
        }
    },
    onStartDrag: function () {
        var a = this.dragData.record;
        if (this.tip) {
            this.tip.enable();
            this.tip.show(Ext.get(this.dragData.sourceNode));
            this.tip.update(a.getStartDate(), a.getEndDate(), true)
        }
        this.gantt.fireEvent("taskdragstart", this.gantt, a)
    },
    getDragData: function (i) {
        var h = this.gantt,
            f = i.getTarget(h.eventSelector);
        if (f && !i.getTarget(".sch-gantt-baseline-item")) {
            var c = Ext.get(f),
                d = h.resolveTaskRecord(c);
            if (h.fireEvent("beforetaskdrag", h, d, i) === false) {
                return null
            }
            var j = f.cloneNode(true),
                b = h.getSnapPixelAmount(),
                a = c.getXY();
            j.id = Ext.id();
            if (b <= 1) {
                Ext.fly(j).setStyle("left", 0)
            }
            this.constrainTo(Ext.fly(h.findItemByChild(f)).getRegion(), c.getRegion());
            if (b >= 1) {
                this.setXConstraint(this.leftConstraint, this.rightConstraint, b)
            }
            return {
                sourceNode: f,
                repairXY: a,
                ddel: j,
                record: d,
                duration: Sch.util.Date.getDurationInMinutes(d.getStartDate(), d.getEndDate())
            }
        }
        return null
    },
    afterRepair: function () {
        Ext.fly(this.dragData.sourceNode).show();
        if (this.tip) {
            this.tip.hide()
        }
        this.dragging = false
    },
    getRepairXY: function () {
        this.gantt.fireEvent("afterdnd", this.gantt);
        return this.dragData.repairXY
    },
    onDragDrop: function (g, i) {
        var f = this.cachedTarget || Ext.dd.DragDropMgr.getDDById(i),
            d = this.dragData,
            b = this.gantt,
            a = d.record,
            h = d.start;
        var c = false;
        if (this.tip) {
            this.tip.disable()
        }
        if (this.valid && h && a.getStartDate() - h !== 0) {
            b.taskStore.on("update", function () {
                c = true
            }, null, {
                single: true
            });
            a.setStartDate(h, true, b.taskStore.skipWeekendsDuringDragDrop);
            if (c) {
                b.fireEvent("taskdrop", b, a);
                if (Ext.isIE9) {
                    this.proxy.el.setStyle("visibility", "hidden");
                    Ext.Function.defer(this.onValidDrop, 10, this, [f, g, i])
                } else {
                    this.onValidDrop(f, g, i)
                }
            }
        }
        if (!c) {
            this.onInvalidDrop(f, g, i)
        }
        b.fireEvent("aftertaskdrop", b, a)
    }
});
Ext.define("Gnt.feature.DependencyDragDrop", {
    extend: "Ext.util.Observable",
    constructor: function (b) {
        this.addEvents("beforednd", "dndstart", "drop", "afterdnd");
        var a = b.ganttView;
        Ext.apply(this, {
            el: a.el,
            ddGroup: a.id + "-sch-dependency-dd",
            ganttView: a,
            dependencyStore: a.getDependencyStore()
        });
        this.el.on("mousemove", function () {
            this.setupDragZone();
            this.setupDropZone()
        }, this, {
            single: true
        });
        this.callParent(arguments)
    },
    fromText: "From: <strong>{0}</strong> {1}<br/>",
    toText: "To: <strong>{0}</strong> {1}",
    startText: "Start",
    endText: "End",
    useLineProxy: true,
    terminalSelector: ".sch-gantt-terminal",
    destroy: function () {
        if (this.dragZone) {
            this.dragZone.destroy()
        }
        if (this.dropZone) {
            this.dropZone.destroy()
        }
        if (this.lineProxyEl) {
            this.lineProxyEl.destroy()
        }
    },
    initLineProxy: function (b, a) {
        var c = this.lineProxyEl = this.el.createChild({
            cls: "sch-gantt-connector-proxy"
        });
        c.alignTo(b, a ? "l" : "r");
        Ext.apply(this, {
            containerTop: this.el.getTop(),
            containerLeft: this.el.getLeft(),
            startXY: c.getXY(),
            startScrollLeft: this.el.dom.scrollLeft,
            startScrollTop: this.el.dom.scrollTop
        })
    },
    updateLineProxy: function (m) {
        var a = this.lineProxyEl,
            j = m[0] - this.startXY[0] + this.el.dom.scrollLeft - this.startScrollLeft,
            i = m[1] - this.startXY[1] + this.el.dom.scrollTop - this.startScrollTop,
            b = Math.max(1, Math.sqrt(Math.pow(j, 2) + Math.pow(i, 2)) - 2),
            h = Math.atan2(i, j) - (Math.PI / 2),
            e;
        if (Ext.isIE) {
            var k = Math.cos(h),
                g = Math.sin(h),
                l = 'progid:DXImageTransform.Microsoft.Matrix(sizingMethod="auto expand", M11 = ' + k + ", M12 = " + (-g) + ", M21 = " + g + ", M22 = " + k + ")",
                d, f;
            if (this.el.dom.scrollTop !== this.startScrollTop) {
                d = this.startScrollTop - this.containerTop
            } else {
                d = this.el.dom.scrollTop - this.containerTop
            }
            if (this.el.dom.scrollLeft !== this.startScrollLeft) {
                f = this.startScrollLeft - this.containerLeft
            } else {
                f = this.el.dom.scrollLeft - this.containerLeft
            }
            e = {
                height: b + "px",
                top: Math.min(0, i) + this.startXY[1] + d + (i < 0 ? 2 : 0) + "px",
                left: Math.min(0, j) + this.startXY[0] + f + (j < 0 ? 2 : 0) + "px",
                filter: l,
                "-ms-filter": l
            }
        } else {
            var c = "rotate(" + h + "rad)";
            e = {
                height: b + "px",
                "-o-transform": c,
                "-webkit-transform": c,
                "-moz-transform": c,
                transform: c
            }
        }
        a.show().setStyle(e)
    },
    setupDragZone: function () {
        var b = this,
            a = this.ganttView;
        this.dragZone = Ext.create("Ext.dd.DragZone", this.el, {
            ddGroup: this.ddGroup,
            onStartDrag: function () {
                this.el.addCls("sch-gantt-dep-dd-dragging");
                b.fireEvent("dndstart", b);
                if (b.useLineProxy) {
                    var c = this.dragData;
                    b.initLineProxy(c.sourceNode, c.isStart)
                }
            },
            getDragData: function (g) {
                var f = g.getTarget(b.terminalSelector);
                if (f) {
                    var d = a.resolveTaskRecord(f);
                    if (b.fireEvent("beforednd", this, d) === false) {
                        return null
                    }
                    var c = !! f.className.match("sch-gantt-terminal-start"),
                        h = Ext.core.DomHelper.createDom({
                            cls: "sch-dd-dependency",
                            children: [{
                                tag: "span",
                                cls: "sch-dd-dependency-from",
                                html: Ext.String.format(b.fromText, d.getName(), c ? b.startText : b.endText)
                            }, {
                                tag: "span",
                                cls: "sch-dd-dependency-to",
                                html: Ext.String.format(b.toText, "", "")
                            }]
                        });
                    return {
                        fromId: d.getId() || d.internalId,
                        isStart: c,
                        repairXY: Ext.fly(f).getXY(),
                        ddel: h,
                        sourceNode: Ext.fly(f).up(a.eventSelector)
                    }
                }
                return false
            },
            afterRepair: function () {
                this.el.removeCls("sch-gantt-dep-dd-dragging");
                this.dragging = false;
                b.fireEvent("afterdnd", this)
            },
            onMouseUp: function () {
                this.el.removeCls("sch-gantt-dep-dd-dragging");
                if (b.lineProxyEl) {
                    if (Ext.isIE) {
                        Ext.destroy(b.lineProxyEl);
                        b.lineProxyEl = null
                    } else {
                        b.lineProxyEl.animate({
                            to: {
                                height: 0
                            },
                            duration: 500,
                            callback: function () {
                                Ext.destroy(b.lineProxyEl);
                                b.lineProxyEl = null
                            }
                        })
                    }
                }
            },
            getRepairXY: function () {
                return this.dragData.repairXY
            }
        })
    },
    setupDropZone: function () {
        var b = this,
            a = this.ganttView;
        this.dropZone = Ext.create("Ext.dd.DropZone", this.el, {
            ddGroup: this.ddGroup,
            getTargetFromEvent: function (c) {
                if (b.useLineProxy) {
                    b.updateLineProxy(c.getXY())
                }
                return c.getTarget(b.terminalSelector)
            },
            onNodeEnter: function (h, c, g, f) {
                var d = h.className.match("sch-gantt-terminal-start");
                Ext.fly(h).addCls(d ? "sch-gantt-terminal-start-drophover" : "sch-gantt-terminal-end-drophover")
            },
            onNodeOut: function (h, c, g, f) {
                var d = h.className.match("sch-gantt-terminal-start");
                Ext.fly(h).removeCls(d ? "sch-gantt-terminal-start-drophover" : "sch-gantt-terminal-end-drophover")
            },
            onNodeOver: function (k, c, j, i) {
                var d = a.resolveTaskRecord(k),
                    f = d.getId() || d.internalId,
                    g = k.className.match("sch-gantt-terminal-start"),
                    h = Ext.String.format(b.toText, d.getName(), g ? b.startText : b.endText);
                c.proxy.el.down(".sch-dd-dependency-to").update(h);
                if (b.dependencyStore.isValidDependency(i.fromId, f)) {
                    return this.dropAllowed
                } else {
                    return this.dropNotAllowed
                }
            },
            onNodeDrop: function (h, l, i, f) {
                var j, c = true,
                    d = Gnt.model.Dependency.Type,
                    g = a.resolveTaskRecord(h),
                    k = g.getId() || g.internalId;
                if (b.lineProxyEl) {
                    Ext.destroy(b.lineProxyEl);
                    b.lineProxyEl = null
                }
                this.el.removeCls("sch-gantt-dep-dd-dragging");
                if (f.isStart) {
                    if (h.className.match("sch-gantt-terminal-start")) {
                        j = d.StartToStart
                    } else {
                        j = d.StartToEnd
                    }
                } else {
                    if (h.className.match("sch-gantt-terminal-start")) {
                        j = d.EndToStart
                    } else {
                        j = d.EndToEnd
                    }
                }
                c = b.dependencyStore.isValidDependency(f.fromId, k);
                if (c) {
                    b.fireEvent("drop", this, f.fromId, k, j)
                }
                b.fireEvent("afterdnd", this);
                return c
            }
        })
    }
});
Ext.define("Gnt.feature.DragCreator", {
    requires: ["Ext.Template", "Sch.util.DragTracker", "Gnt.Tooltip"],
    constructor: function (a) {
        Ext.apply(this, a || {});
        this.init()
    },
    disabled: false,
    showDragTip: true,
    dragTolerance: 2,
    setDisabled: function (a) {
        this.disabled = a;
        if (this.dragTip) {
            this.dragTip.setDisabled(a)
        }
    },
    getProxy: function () {
        if (!this.proxy) {
            this.proxy = this.template.append(this.ganttView.ownerCt.el, {}, true)
        }
        return this.proxy
    },
    onBeforeDragStart: function (f) {
        var c = this.ganttView,
            b = f.getTarget("." + c.timeCellCls, 2);
        if (b) {
            var a = c.resolveTaskRecord(b);
            var d = c.getDateFromDomEvent(f);
            if (!this.disabled && b && !a.getStartDate() && !a.getEndDate() && c.fireEvent("beforedragcreate", c, a, d, f) !== false) {
                f.stopEvent();
                this.taskRecord = a;
                this.originalStart = d;
                this.rowRegion = c.getScheduleRegion(this.taskRecord, this.originalStart);
                this.dateConstraints = c.getDateConstraints(this.resourceRecord, this.originalStart);
                return true
            }
        }
        return false
    },
    onDragStart: function () {
        var c = this,
            a = c.ganttView,
            b = c.getProxy();
        c.start = c.originalStart;
        c.end = c.start;
        c.rowBoundaries = {
            top: c.rowRegion.top,
            bottom: c.rowRegion.bottom
        };
        b.setRegion({
            top: c.rowBoundaries.top,
            right: c.tracker.startXY[0],
            bottom: c.rowBoundaries.bottom,
            left: c.tracker.startXY[0]
        });
        b.show();
        c.ganttView.fireEvent("dragcreatestart", c.ganttView);
        if (c.showDragTip) {
            c.dragTip.update(c.start, c.end, true, this.taskRecord);
            c.dragTip.enable();
            c.dragTip.show(b)
        }
    },
    onDrag: function (g) {
        var d = this,
            c = d.ganttView,
            b = d.tracker.getRegion().constrainTo(d.rowRegion),
            f = c.getStartEndDatesFromRegion(b, "round");
        if (!f) {
            return
        }
        d.start = f.start || d.start;
        d.end = f.end || d.end;
        var a = d.dateConstraints;
        if (a) {
            d.end = Sch.util.Date.constrain(d.end, a.start, a.end);
            d.start = Sch.util.Date.constrain(d.start, a.start, a.end)
        }
        if (d.showDragTip) {
            d.dragTip.update(d.start, d.end, true, this.taskRecord)
        }
        Ext.apply(b, d.rowBoundaries);
        this.getProxy().setRegion(b)
    },
    onDragEnd: function (b) {
        var c = this.ganttView,
            a = true;
        if (this.showDragTip) {
            this.dragTip.disable()
        }
        if (!this.start || !this.end || (this.end < this.start)) {
            a = false
        }
        if (a) {
            this.taskRecord.setStartEndDate(this.start, this.end);
            c.fireEvent("dragcreateend", c, this.taskRecord, b)
        }
        this.proxy.hide();
        c.fireEvent("afterdragcreate", c)
    },
    init: function () {
        var c = this.ganttView,
            a = c.el,
            b = Ext.Function.bind;
        this.lastTime = new Date();
        this.template = this.template || Ext.create("Ext.Template", '<div class="sch-gantt-dragcreator-proxy"></div>', {
            compiled: true,
            disableFormats: true
        });
        c.on({
            destroy: this.onGanttDestroy,
            scope: this
        });
        this.tracker = new Sch.util.DragTracker({
            el: a,
            tolerance: this.dragTolerance,
            onBeforeStart: b(this.onBeforeDragStart, this),
            onStart: b(this.onDragStart, this),
            onDrag: b(this.onDrag, this),
            onEnd: b(this.onDragEnd, this)
        });
        if (this.showDragTip) {
            this.dragTip = Ext.create("Gnt.Tooltip", {
                mode: "duration",
                cls: "sch-gantt-dragcreate-tip",
                gantt: c
            })
        }
    },
    onGanttDestroy: function () {
        if (this.dragTip) {
            this.dragTip.destroy()
        }
        if (this.tracker) {
            this.tracker.destroy()
        }
        if (this.proxy) {
            Ext.destroy(this.proxy);
            this.proxy = null
        }
    }
});
Ext.define("Gnt.feature.LabelEditor", {
    extend: "Ext.Editor",
    labelPosition: "",
    constructor: function (b, a) {
        this.ganttView = b;
        this.ganttView.on("afterrender", this.onGanttRender, this);
        this.callParent([a])
    },
    edit: function (a) {
        var b = this.ganttView.getElementFromEventRecord(a).up(this.ganttView.eventWrapSelector);
        this.record = a;
        this.startEdit(b.down(this.delegate), this.dataIndex ? a.get(this.dataIndex) : "")
    },
    delegate: "",
    dataIndex: "",
    shadow: false,
    completeOnEnter: true,
    cancelOnEsc: true,
    ignoreNoChange: true,
    onGanttRender: function (a) {
        if (!this.field.width) {
            this.autoSize = "width"
        }
        this.on({
            beforestartedit: function (c, b, d) {
                return a.fireEvent("labeledit_beforestartedit", a, this.record, d, c)
            },
            beforecomplete: function (c, d, b) {
                return a.fireEvent("labeledit_beforecomplete", a, d, b, this.record, c)
            },
            complete: function (c, d, b) {
                this.record.set(this.dataIndex, d);
                a.fireEvent("labeledit_complete", a, d, b, this.record, c)
            },
            scope: this
        });
        a.el.on("dblclick", function (c, b) {
            this.edit(a.resolveTaskRecord(b))
        }, this, {
            delegate: this.delegate
        })
    }
});
Ext.define("Gnt.feature.ProgressBarResize", {
    requires: ["Ext.QuickTip", "Ext.resizer.Resizer"],
    constructor: function (a) {
        Ext.apply(this, a || {});
        var b = this.gantt;
        b.on({
            destroy: this.cleanUp,
            scope: this
        });
        b.mon(b.el, "mousedown", this.onMouseDown, this, {
            delegate: ".sch-gantt-progressbar-handle"
        });
        this.callParent(arguments)
    },
    useTooltip: true,
    increment: 10,
    onMouseDown: function (d, b) {
        var c = this.gantt,
            f = c.resolveTaskRecord(b);
        if (c.fireEvent("beforeprogressbarresize", c, f) !== false) {
            var a = Ext.fly(b).prev(".sch-gantt-progress-bar");
            d.stopEvent();
            this.createResizable(a, f, d);
            c.fireEvent("progressbarresizestart", c, f)
        }
    },
    createResizable: function (d, a, h) {
        var c = h.getTarget(),
            i = d.up(this.gantt.eventSelector),
            g = i.getWidth() - 4,
            b = g * this.increment / 100;
        var f = Ext.create("Ext.resizer.Resizer", {
            target: d,
            taskRecord: a,
            handles: "e",
            minWidth: 0,
            maxWidth: g,
            minHeight: 1,
            widthIncrement: b,
            listeners: {
                resizedrag: this.partialResize,
                resize: this.afterResize,
                scope: this
            }
        });
        f.resizeTracker.onMouseDown(h, f.east.dom);
        i.select(".x-resizable-handle, .sch-gantt-terminal, .sch-gantt-progressbar-handle").hide();
        if (this.useTooltip) {
            if (!this.tip) {
                this.tip = Ext.create("Ext.ToolTip", {
                    autoHide: false,
                    anchor: "b",
                    html: "%"
                })
            }
            this.tip.setTarget(d);
            this.tip.show();
            this.tip.body.update(a.getPercentDone() + "%")
        }
    },
    partialResize: function (c, b) {
        var a = Math.round(b * 100 / (c.maxWidth * this.increment)) * this.increment;
        if (this.tip) {
            this.tip.body.update(a + "%")
        }
    },
    afterResize: function (d, a, b, f) {
        var g = d.taskRecord;
        if (this.tip) {
            this.tip.hide()
        }
        var c = Math.round(a * 100 / (d.maxWidth * this.increment)) * this.increment;
        d.taskRecord.setPercentDone(c);
        d.destroy();
        this.gantt.fireEvent("afterprogressbarresize", this.gantt, g)
    },
    cleanUp: function () {
        if (this.tip) {
            this.tip.destroy()
        }
    }
});
Ext.define("Gnt.feature.TaskResize", {
    constructor: function (a) {
        Ext.apply(this, a);
        var b = this.gantt;
        b.on({
            destroy: this.cleanUp,
            scope: this
        });
        b.mon(b.el, "mousedown", this.onMouseDown, this, {
            delegate: ".sch-resizable-handle"
        });
        this.callParent(arguments)
    },
    showDuration: true,
    useTooltip: true,
    validatorFn: Ext.emptyFn,
    validatorFnScope: null,
    onMouseDown: function (c) {
        var b = this.gantt,
            a = c.getTarget(b.eventSelector),
            d = b.resolveTaskRecord(a);
        if (b.fireEvent("beforetaskresize", b, d, c) === false) {
            return
        }
        c.stopEvent();
        this.createResizable(Ext.get(a), d, c);
        b.fireEvent("taskresizestart", b, d)
    },
    createResizable: function (c, k, j) {
        var m = j.getTarget(),
            i = this.gantt,
            a = !! m.className.match("sch-resizable-handle-west"),
            d = i.getSnapPixelAmount(),
            f = c.getWidth(),
            l = c.up(".x-grid-row").getRegion();
        this.resizable = Ext.create("Ext.resizer.Resizer", {
            startLeft: c.getLeft(),
            startRight: c.getRight(),
            target: c,
            taskRecord: k,
            handles: a ? "w" : "e",
            constrainTo: l,
            minHeight: 1,
            minWidth: d,
            widthIncrement: d,
            listeners: {
                resizedrag: this[a ? "partialWestResize" : "partialEastResize"],
                resize: this.afterResize,
                scope: this
            }
        });
        this.resizable.resizeTracker.onMouseDown(j, this.resizable[a ? "west" : "east"].dom);
        if (this.useTooltip) {
            if (!this.tip) {
                this.tip = Ext.create("Gnt.Tooltip", {
                    mode: this.showDuration ? "duration" : "startend",
                    gantt: this.gantt
                })
            }
            var b = k.getStartDate(),
                h = k.getEndDate();
            this.tip.show(c);
            this.tip.update(b, h, true, k)
        }
    },
    partialEastResize: function (i, f, b, g) {
        var c = this.gantt,
            a = c.getDateFromXY([i.startLeft + Math.min(f, this.resizable.maxWidth), 0], "round");
        if (!a || i.end - a === 0) {
            return
        }
        var h = i.taskRecord.getStartDate(),
            d = this.validatorFn.call(this.validatorFnScope || this, i.taskRecord, h, a) !== false;
        i.end = a;
        c.fireEvent("partialtaskresize", c, i.taskRecord, h, a, i.el, g);
        if (this.useTooltip) {
            this.tip.update(h, a, d, i.taskRecord)
        }
    },
    partialWestResize: function (i, f, b, g) {
        var c = this.gantt,
            h = c.getDateFromXY([i.startRight - Math.min(f, this.resizable.maxWidth), 0], "round");
        if (!h || i.start - h === 0) {
            return
        }
        var a = i.taskRecord.getEndDate(),
            d = this.validatorFn.call(this.validatorFnScope || this, i.taskRecord, h, a) !== false;
        i.start = h;
        c.fireEvent("partialtaskresize", c, i.taskRecord, h, a, i.el, g);
        if (this.useTooltip) {
            this.tip.update(h, a, d, i.taskRecord)
        }
    },
    afterResize: function (a, l, i, j) {
        if (this.useTooltip) {
            this.tip.hide()
        }
        var k = a.taskRecord,
            g = k.getStartDate(),
            m = k.getEndDate(),
            c = a.start || g,
            f = a.end || m,
            d = this.gantt;
        a.destroy();
        if (c && f && (c - g || f - m) && this.validatorFn.call(this.validatorFnScope || this, k, c, f, j) !== false) {
            var b = this.gantt.taskStore.skipWeekendsDuringDragDrop;
            if (c - g !== 0) {
                k.setStartDate(c <= f ? c : f, false, b)
            } else {
                k.setEndDate(c <= f ? f : c, false, b)
            }
        } else {
            d.refreshKeepingScroll()
        }
        d.fireEvent("aftertaskresize", d, k)
    },
    cleanUp: function () {
        if (this.tip) {
            this.tip.destroy()
        }
    }
});
Ext.define("Gnt.feature.WorkingTime", {
    extend: "Sch.plugin.Zones",
    requires: ["Ext.data.Store", "Sch.model.Range"],
    expandToFitView: true,
    calendar: null,
    init: function (a) {
        if (!this.calendar) {
            Ext.Error.raise("Required attribute 'calendar' missed during initialization of 'Gnt.feature.WorkingTime'")
        }
        this.bindCalendar(this.calendar);
        Ext.apply(this, {
            store: new Ext.data.Store({
                model: "Sch.model.Range"
            })
        });
        this.callParent(arguments);
        a.on("viewchange", this.onViewChange, this);
        this.onViewChange()
    },
    bindCalendar: function (b) {
        var a = {
            datachanged: this.refresh,
            update: this.refresh,
            scope: this,
            delay: 1
        };
        if (this.calendar) {
            this.calendar.un(a)
        }
        b.on(a);
        this.calendar = b
    },
    onViewChange: function () {
        var a = Sch.util.Date;
        if (a.compareUnits(this.timeAxis.unit, a.WEEK) > 0) {
            this.setDisabled(true)
        } else {
            this.setDisabled(false);
            this.refresh()
        }
    },
    refresh: function () {
        var a = this.schedulerView;
        this.store.removeAll(true);
        this.store.add(this.calendar.getHolidaysRanges(a.getStart(), a.getEnd(), true))
    }
});
Ext.define("Gnt.plugin.DependencyEditor", {
    extend: "Ext.form.FormPanel",
    mixins: ["Ext.AbstractPlugin"],
    lockableScope: "normal",
    requires: ["Ext.form.DisplayField", "Ext.form.ComboBox", "Ext.form.NumberField", "Gnt.model.Dependency"],
    hideOnBlur: true,
    fromText: "From",
    toText: "To",
    typeText: "Type",
    lagText: "Lag",
    endToStartText: "Finish-To-Start",
    startToStartText: "Start-To-Start",
    endToEndText: "Finish-To-Finish",
    startToEndText: "Start-To-Finish",
    showLag: false,
    border: false,
    height: 150,
    width: 260,
    frame: true,
    labelWidth: 60,
    constrain: false,
    initComponent: function () {
        Ext.apply(this, {
            items: this.buildFields(),
            defaults: {
                width: 240
            },
            floating: true,
            hideMode: "offsets"
        });
        this.callParent(arguments)
    },
    beforeRender: function () {
        this.addCls("sch-gantt-dependencyeditor");
        this.callParent(arguments)
    },
    init: function (a) {
        a.on("dependencydblclick", this.onDependencyDblClick, this);
        a.on("render", this.onGanttRender, this, {
            delay: 50
        });
        this.gantt = a;
        this.taskStore = a.getTaskStore()
    },
    onGanttRender: function () {
        this.render(Ext.getBody());
        this.collapse(Ext.Component.DIRECTION_TOP, true);
        this.hide();
        if (this.hideOnBlur) {
            this.mon(Ext.getBody(), "click", this.onMouseClick, this)
        }
    },
    show: function (a, b) {
        this.dependencyRecord = a;
        this.getForm().loadRecord(a);
        this.fromLabel.setValue(this.dependencyRecord.getSourceTask().getName());
        this.toLabel.setValue(this.dependencyRecord.getTargetTask().getName());
        this.callParent([]);
        this.el.setXY(b);
        this.expand(!this.constrain);
        if (this.constrain) {
            this.doConstrain(Ext.util.Region.getRegion(Ext.getBody()))
        }
    },
    buildFields: function () {
        var c = this,
            d = Gnt.model.Dependency,
            b = d.Type,
            a = [this.fromLabel = Ext.create("Ext.form.DisplayField", {
                fieldLabel: this.fromText
            }), this.toLabel = Ext.create("Ext.form.DisplayField", {
                fieldLabel: this.toText
            }), this.typeField = Ext.create("Ext.form.ComboBox", {
                name: d.prototype.nameField,
                fieldLabel: this.typeText,
                triggerAction: "all",
                queryMode: "local",
                valueField: "value",
                displayField: "text",
                editable: false,
                store: Ext.create("Ext.data.JsonStore", {
                    fields: ["text", "value"],
                    data: [{
                        text: this.endToStartText,
                        value: b.EndToStart
                    }, {
                        text: this.startToStartText,
                        value: b.StartToStart
                    }, {
                        text: this.endToEndText,
                        value: b.EndToEnd
                    }, {
                        text: this.startToEndText,
                        value: b.StartToEnd
                    }]
                })
            })];
        if (this.showLag) {
            a.push(this.lagField = Ext.create("Ext.form.NumberField", {
                name: d.prototype.lagField,
                fieldLabel: this.lagText
            }))
        }
        return a
    },
    onDependencyDblClick: function (c, a, d, b) {
        if (this.lagField) {
            this.lagField.name = a.lagField
        }
        if (this.typeField) {
            this.typeField.name = a.typeField
        }
        if (a != this.dependencyRecord) {
            this.show(a, d.getXY())
        }
    },
    onMouseClick: function (a) {
        if (this.collapsed || a.within(this.getEl()) || a.getTarget(".x-layer") || a.getTarget(".sch-ignore-click")) {
            return
        }
        this.collapse()
    },
    afterCollapse: function () {
        delete this.dependencyRecord;
        this.hide();
        this.callParent(arguments)
    }
});
Ext.define("Gnt.plugin.TaskContextMenu", {
    extend: "Ext.menu.Menu",
    mixins: ["Ext.AbstractPlugin"],
    lockableScope: "top",
    requires: ["Gnt.model.Dependency"],
    plain: true,
    triggerEvent: "taskcontextmenu",
    texts: {
        newTaskText: "New task",
        newMilestoneText: "New milestone",
        deleteTask: "Delete task(s)",
        editLeftLabel: "Edit left label",
        editRightLabel: "Edit right label",
        add: "Add...",
        deleteDependency: "Delete dependency...",
        addTaskAbove: "Task above",
        addTaskBelow: "Task below",
        addMilestone: "Milestone",
        addSubtask: "Sub-task",
        addSuccessor: "Successor",
        addPredecessor: "Predecessor"
    },
    grid: null,
    rec: null,
    lastHighlightedItem: null,
    createMenuItems: function () {
        var a = this.texts;
        return [{
            handler: this.deleteTask,
            requiresTask: true,
            scope: this,
            text: a.deleteTask
        }, {
            handler: this.editLeftLabel,
            requiresTask: true,
            scope: this,
            text: a.editLeftLabel
        }, {
            handler: this.editRightLabel,
            requiresTask: true,
            scope: this,
            text: a.editRightLabel
        }, {
            text: a.add,
            menu: {
                plain: true,
                items: [{
                    handler: this.addTaskAboveAction,
                    requiresTask: true,
                    scope: this,
                    text: a.addTaskAbove
                }, {
                    handler: this.addTaskBelowAction,
                    scope: this,
                    text: a.addTaskBelow
                }, {
                    handler: this.addMilestone,
                    requiresTask: true,
                    scope: this,
                    text: a.addMilestone
                }, {
                    handler: this.addSubtask,
                    requiresTask: true,
                    scope: this,
                    text: a.addSubtask
                }, {
                    handler: this.addSuccessor,
                    requiresTask: true,
                    scope: this,
                    text: a.addSuccessor
                }, {
                    handler: this.addPredecessor,
                    requiresTask: true,
                    scope: this,
                    text: a.addPredecessor
                }]
            }
        }, {
            text: a.deleteDependency,
            requiresTask: true,
            menu: {
                plain: true,
                listeners: {
                    beforeshow: this.populateDependencyMenu,
                    mouseover: this.onDependencyMouseOver,
                    mouseleave: this.onDependencyMouseOut,
                    scope: this
                }
            }
        }]
    },
    buildMenuItems: function () {
        this.items = this.createMenuItems()
    },
    initComponent: function () {
        this.buildMenuItems();
        this.callParent(arguments)
    },
    init: function (b) {
        b.on("destroy", this.cleanUp, this);
        var a = b.getSchedulingView(),
            c = b.lockedGrid.getView();
        if (this.triggerEvent === "itemcontextmenu") {
            c.on("itemcontextmenu", this.onItemContextMenu, this);
            a.on("itemcontextmenu", this.onItemContextMenu, this)
        }
        a.on("taskcontextmenu", this.onTaskContextMenu, this);
        a.on("containercontextmenu", this.onContainerContextMenu, this);
        c.on("containercontextmenu", this.onContainerContextMenu, this);
        this.grid = b
    },
    populateDependencyMenu: function (f) {
        var d = this.grid,
            b = d.getTaskStore(),
            e = this.rec.getAllDependencies(),
            a = d.dependencyStore;
        f.removeAll();
        if (e.length === 0) {
            return false
        }
        var c = this.rec.getId() || this.rec.internalId;
        Ext.each(e, function (i) {
            var h = i.getSourceId(),
                g = b.getById(h == c ? i.getTargetId() : h);
            if (g) {
                f.add({
                    depId: i.internalId,
                    text: Ext.util.Format.ellipsis(g.getName(), 30),
                    scope: this,
                    handler: function (k) {
                        var j;
                        a.each(function (l) {
                            if (l.internalId == k.depId) {
                                j = l;
                                return false
                            }
                        });
                        a.remove(j)
                    }
                })
            }
        }, this)
    },
    onDependencyMouseOver: function (d, a, b) {
        if (a) {
            var c = this.grid.getSchedulingView();
            if (this.lastHighlightedItem) {
                c.unhighlightDependency(this.lastHighlightedItem.depId)
            }
            this.lastHighlightedItem = a;
            c.highlightDependency(a.depId)
        }
    },
    onDependencyMouseOut: function (b, a) {
        if (this.lastHighlightedItem) {
            this.grid.getSchedulingView().unhighlightDependency(this.lastHighlightedItem.depId)
        }
    },
    cleanUp: function () {
        this.destroy()
    },
    onTaskContextMenu: function (b, a, c) {
        this.activateMenu(a, c)
    },
    onItemContextMenu: function (b, a, d, c, f) {
        this.activateMenu(a, f)
    },
    onContainerContextMenu: function (a, b) {
        this.activateMenu(null, b)
    },
    activateMenu: function (c, b) {
        if (this.grid.isReadOnly()) {
            return
        }
        b.stopEvent();
        this.rec = c;
        var a = this.query("[requiresTask]");
        Ext.each(a, function (d) {
            d.setDisabled(!c)
        });
        this.showAt(b.getXY())
    },
    copyTask: function (c) {
        var b = this.grid.getTaskStore().model;
        var a = new b({
            leaf: true
        });
        a.setPercentDone(0);
        a.setName(this.texts.newTaskText);
        a.set(a.startDateField, (c && c.getStartDate()) || null);
        a.set(a.endDateField, (c && c.getEndDate()) || null);
        a.set(a.durationField, (c && c.getDuration()) || null);
        a.set(a.durationUnitField, (c && c.getDurationUnit()) || "d");
        return a
    },
    addTaskAbove: function (a) {
        var b = this.rec;
        if (b) {
            b.addTaskAbove(a)
        } else {
            this.grid.taskStore.getRootNode().appendChild(a)
        }
    },
    addTaskBelow: function (a) {
        var b = this.rec;
        if (b) {
            b.addTaskBelow(a)
        } else {
            this.grid.taskStore.getRootNode().appendChild(a)
        }
    },
    deleteTask: function () {
        var a = this.grid.getSelectionModel().selected;
        this.grid.taskStore.remove(a.items)
    },
    editLeftLabel: function () {
        this.grid.getSchedulingView().editLeftLabel(this.rec)
    },
    editRightLabel: function () {
        this.grid.getSchedulingView().editRightLabel(this.rec)
    },
    addTaskAboveAction: function () {
        this.addTaskAbove(this.copyTask(this.rec))
    },
    addTaskBelowAction: function () {
        this.addTaskBelow(this.copyTask(this.rec))
    },
    addSubtask: function () {
        var a = this.rec;
        a.addSubtask(this.copyTask(a))
    },
    addSuccessor: function () {
        var a = this.rec;
        a.addSuccessor(this.copyTask(a))
    },
    addPredecessor: function () {
        var a = this.rec;
        a.addPredecessor(this.copyTask(a))
    },
    addMilestone: function () {
        var b = this.rec,
            a = this.copyTask(b);
        b.addTaskBelow(a);
        a.setStartEndDate(b.getEndDate(), b.getEndDate())
    }
});
Ext.define("Gnt.plugin.PdfExport", {
    extend: "Sch.plugin.PdfExport",
    getExportJsonHtml: function (d, g) {
        var b = this.scheduler.getSchedulingView(),
            c = b.dependencyView,
            a = c.painter.getDependencyTplData(b.dependencyStore.getRange()),
            e = c.lineTpl.apply(a),
            f = {
                dependencies: e,
                rowsAmount: d.rowsAmount,
                columnsAmountNormal: d.columnsAmountNormal,
                columnsAmountLocked: d.columnsAmountLocked,
                timeColumnWidth: d.timeColumnWidth,
                lockedGridWidth: d.lockedGridWidth,
                rowHeight: d.rowHeight
            };
        d.panelHTML = f;
        return this.callParent(arguments)
    },
    resizePanelHTML: function (e) {
        var f = this.callParent(arguments),
            b = f.select(".sch-dependencyview-ct").first(),
            d = e.k * e.rowsAmount * e.rowHeight,
            c = e.i * e.timeColumnWidth * (e.i === 1 ? e.columnsAmountLocked : e.columnsAmountNormal);
        b.dom.innerHTML = e.dependencies;
        b.applyStyles({
            top: -d + "px",
            left: -c + "px"
        });
        var a = f.select(".x-splitter").first();
        a.setHeight("100%");
        return f
    }
});
Ext.define("Gnt.plugin.Printable", {
    extend: "Sch.plugin.Printable",
    getGridContent: function (c) {
        var f = this.callParent(arguments),
            d = c.getSchedulingView(),
            e = d.dependencyView,
            b = e.painter.getDependencyTplData(d.dependencyStore.getRange()),
            a;
        a = f.normalRows;
        f.normalRows = e.lineTpl.apply(b) + a;
        return f
    }
});
Ext.define("Gnt.view.DependencyPainter", {
    extend: "Ext.util.Observable",
    requires: ["Ext.util.Region"],
    constructor: function (a) {
        a = a || {};
        Ext.apply(this, a, {
            xOffset: 8,
            yOffset: 7,
            midRowOffset: 6,
            arrowOffset: 8
        })
    },
    getTaskBox: function (o) {
        var f = Sch.util.Date,
            h = o.getStartDate(),
            n = o.getEndDate(),
            c = this.ganttView.getStart(),
            b = this.ganttView.getEnd(),
            j = this.ganttView,
            a = j.getXYFromDate(f.max(h, c))[0],
            p = j.getXYFromDate(f.min(n, b))[0],
            i = this.taskStore.buffered,
            d, l = Ext.get(j.getEventNodeByRecord(o));
        if (!o.isVisible() || !h || !n || !f.intersectSpans(h, n, c, b)) {
            return null
        }
        if (l || i) {
            var q = this.view.getXOffset(o),
                k, g, r = true;
            if (a > q) {
                a -= q
            }
            p += q - 1;
            if (!o.isMilestone() && Ext.isIE) {
                if ((Ext.isIE7 || Ext.isIE6) && !Ext.isIEQuirks) {
                    p += 5;
                    a -= 2
                } else {
                    if ((Ext.isIE6 || Ext.isIE7 || Ext.isIE8) && Ext.isIEQuirks) {
                        p += 1;
                        a -= 2
                    }
                }
            }
            if (l) {
                d = l.getOffsetsTo(j.el);
                k = d[1] + j.el.getScroll().top;
                g = k + l.getHeight()
            } else {
                var e = j.store.first();
                var m = j.getNodes();
                if (o.isAbove(e)) {
                    l = Ext.get(m[0]);
                    d = l.getOffsetsTo(j.el);
                    d[1] -= this.ganttView.rowHeight
                } else {
                    l = Ext.get(m[m.length - 1]);
                    d = l.getOffsetsTo(j.el);
                    d[1] += this.ganttView.rowHeight
                }
                k = d[1] + j.el.getScroll().top;
                g = k + l.getHeight();
                r = false
            }
            return {
                top: k,
                right: p,
                bottom: g,
                left: a,
                rendered: false
            }
        }
    },
    getRenderData: function (f) {
        var e = f.getSourceTask(),
            c = f.getTargetTask();
        if (!e || !c) {
            return null
        }
        var a = this.getTaskBox(e);
        var d = this.getTaskBox(c);
        if (this.taskStore.buffered && a && !a.rendered && d && !d.rendered) {
            var g = this.ganttView.store.first();
            var b = this.ganttView.store.last();
            if ((e.isAbove(g) && c.isAbove(g)) || (b.isAbove(e) && b.isAbove(c))) {
                return null
            }
        }
        return {
            fromBox: a,
            toBox: d
        }
    },
    getDependencyTplData: function (q) {
        var n = this,
            j = n.taskStore;
        if (!Ext.isArray(q)) {
            q = [q]
        }
        if (q.length === 0 || j.getCount() <= 0) {
            return
        }
        var c = [],
            b = Gnt.model.Dependency.Type,
            o = n.ganttView,
            p, k, g, m, h, a;
        for (var f = 0, d = q.length; f < d; f++) {
            a = q[f];
            var e = this.getRenderData(a);
            if (e) {
                m = e.fromBox;
                h = e.toBox;
                if (m && h) {
                    switch (a.getType()) {
                    case b.StartToEnd:
                        p = n.getStartToEndCoordinates(m, h);
                        break;
                    case b.StartToStart:
                        p = n.getStartToStartCoordinates(m, h);
                        break;
                    case b.EndToStart:
                        p = n.getEndToStartCoordinates(m, h);
                        break;
                    case b.EndToEnd:
                        p = n.getEndToEndCoordinates(m, h);
                        break;
                    default:
                        throw "Invalid dependency type: " + a.getType()
                    }
                    if (p) {
                        c.push({
                            lineCoordinates: p,
                            id: a.internalId,
                            cls: a.getCls()
                        })
                    }
                }
            }
        }
        return c
    },
    getStartToStartCoordinates: function (e, d, c, i) {
        var b = e.left,
            g = e.top - 1 + ((e.bottom - e.top) / 2),
            a = d.left,
            f = d.top - 1 + ((d.bottom - d.top) / 2),
            h = e.top < d.top ? (f - this.yOffset - this.midRowOffset) : (f + this.yOffset + this.midRowOffset),
            j = this.xOffset + this.arrowOffset;
        if (b > (a + this.xOffset)) {
            j += (b - a)
        }
        return [{
            x1: b,
            y1: g,
            x2: b - j,
            y2: g
        }, {
            x1: b - j,
            y1: g,
            x2: b - j,
            y2: f
        }, {
            x1: b - j,
            y1: f,
            x2: a - this.arrowOffset,
            y2: f
        }]
    },
    getStartToEndCoordinates: function (f, e) {
        var c = f.left,
            i = f.top - 1 + ((f.bottom - f.top) / 2),
            a = e.right,
            g = e.top - 1 + ((e.bottom - e.top) / 2),
            j = f.top < e.top ? (g - this.yOffset - this.midRowOffset) : (g + this.yOffset + this.midRowOffset),
            h, b;
        if (a > (c + this.xOffset - this.arrowOffset) || Math.abs(a - c) < (2 * (this.xOffset + this.arrowOffset))) {
            b = c - this.xOffset - this.arrowOffset;
            var d = a + this.xOffset + this.arrowOffset;
            h = [{
                x1: c,
                y1: i,
                x2: b,
                y2: i
            }, {
                x1: b,
                y1: i,
                x2: b,
                y2: j
            }, {
                x1: b,
                y1: j,
                x2: d,
                y2: j
            }, {
                x1: d,
                y1: j,
                x2: d,
                y2: g
            }, {
                x1: d,
                y1: g,
                x2: a + this.arrowOffset,
                y2: g
            }]
        } else {
            b = c - this.xOffset - this.arrowOffset;
            h = [{
                x1: c,
                y1: i,
                x2: b,
                y2: i
            }, {
                x1: b,
                y1: i,
                x2: b,
                y2: g
            }, {
                x1: b,
                y1: g,
                x2: a + this.arrowOffset,
                y2: g
            }]
        }
        return h
    },
    getEndToStartCoordinates: function (f, e) {
        var c = f.right,
            i = f.top - 1 + ((f.bottom - f.top) / 2),
            a = e.left,
            g = e.top - 1 + ((e.bottom - e.top) / 2),
            j = f.top < e.top ? (g - this.yOffset - this.midRowOffset) : (g + this.yOffset + this.midRowOffset),
            h, b;
        if (a >= (c - 6) && g > i) {
            b = Math.max(c - 6, a) + this.xOffset;
            g = e.top;
            h = [{
                x1: c,
                y1: i,
                x2: b,
                y2: i
            }, {
                x1: b,
                y1: i,
                x2: b,
                y2: g - this.arrowOffset
            }]
        } else {
            b = c + this.xOffset + this.arrowOffset;
            var d = a - this.xOffset - this.arrowOffset;
            if (g > i || a < (c + 2 * this.arrowOffset)) {
                h = [{
                    x1: c,
                    y1: i,
                    x2: b,
                    y2: i
                }, {
                    x1: b,
                    y1: i,
                    x2: b,
                    y2: j
                }, {
                    x1: b,
                    y1: j,
                    x2: d,
                    y2: j
                }, {
                    x1: d,
                    y1: j,
                    x2: d,
                    y2: g
                }, {
                    x1: d,
                    y1: g,
                    x2: a - this.arrowOffset,
                    y2: g
                }]
            } else {
                h = [{
                    x1: c,
                    y1: i,
                    x2: d,
                    y2: i
                }, {
                    x1: d,
                    y1: i,
                    x2: d,
                    y2: g
                }, {
                    x1: d,
                    y1: g,
                    x2: a - this.arrowOffset,
                    y2: g
                }]
            }
        }
        return h
    },
    getEndToEndCoordinates: function (a, c) {
        var d = a.right,
            f = a.top - 1 + ((a.bottom - a.top) / 2),
            b = c.right + this.arrowOffset,
            e = c.top - 1 + ((c.bottom - c.top) / 2),
            g = b + this.xOffset + this.arrowOffset;
        if (d > (b + this.xOffset)) {
            g += d - b
        }
        return [{
            x1: d,
            y1: f,
            x2: g,
            y2: f
        }, {
            x1: g,
            y1: f,
            x2: g,
            y2: e
        }, {
            x1: g,
            y1: e,
            x2: b,
            y2: e
        }]
    }
});
Ext.define("Gnt.view.Dependency", {
    extend: "Ext.util.Observable",
    requires: ["Gnt.feature.DependencyDragDrop", "Gnt.view.DependencyPainter"],
    containerEl: null,
    ganttView: null,
    painter: null,
    taskStore: null,
    store: null,
    dnd: null,
    lineTpl: null,
    enableDependencyDragDrop: true,
    renderAllDepsBuffered: false,
    dependencyCls: "sch-dependency",
    selectedCls: "sch-dependency-selected",
    constructor: function (a) {
        this.callParent(arguments);
        var b = this.ganttView;
        b.on({
            refresh: this.renderAllDependenciesBuffered,
            scope: this
        });
        this.bindTaskStore(b.getTaskStore());
        this.bindDependencyStore(a.store);
        if (!this.lineTpl) {
            this.lineTpl = Ext.create("Ext.XTemplate", '<tpl for=".">' + Ext.String.format('<tpl for="lineCoordinates"><div class="{0} sch-dep-{parent.id} {0}-line {parent.cls}-line " style="left:{[Math.min(values.x1, values.x2)]}px;top:{[Math.min(values.y1, values.y2)]}px;width:{[Math.abs(values.x1-values.x2)' + (Ext.isBorderBox ? "+2" : "") + "]}px;height:{[Math.abs(values.y1-values.y2)" + (Ext.isBorderBox ? "+2" : "") + ']}px"></div></tpl><div style="left:{[values.lineCoordinates[values.lineCoordinates.length - 1].x2]}px;top:{[values.lineCoordinates[values.lineCoordinates.length - 1].y2]}px" class="{0}-arrow-ct {0} sch-dep-{id} {cls}-arrow-ct"><img src="' + Ext.BLANK_IMAGE_URL + '" class="{0}-arrow {0}-arrow-{[this.getArrowDirection(values.lineCoordinates)]} {cls}-arrow" /></div>', this.dependencyCls) + "</tpl>", {
                compiled: true,
                disableFormats: true,
                getArrowDirection: function (d) {
                    var c = d[d.length - 1];
                    if (c.x1 === c.x2) {
                        return "down"
                    } else {
                        if (c.x1 > c.x2) {
                            return "left"
                        } else {
                            return "right"
                        }
                    }
                }
            })
        }
        this.painter = Ext.create("Gnt.view.DependencyPainter", Ext.apply({
            rowHeight: b.rowHeight,
            taskStore: this.taskStore,
            view: b
        }, a));
        this.addEvents("beforednd", "dndstart", "drop", "afterdnd", "beforecascade", "cascade", "dependencydblclick");
        if (this.enableDependencyDragDrop) {
            this.dnd = Ext.create("Gnt.feature.DependencyDragDrop", {
                ganttView: this.ganttView
            });
            this.dnd.on("drop", this.onDependencyDrop, this);
            this.relayEvents(this.dnd, ["beforednd", "dndstart", "afterdnd", "drop"])
        }
        this.containerEl = this.containerEl.createChild({
            cls: "sch-dependencyview-ct"
        });
        this.ganttView.mon(this.containerEl, "dblclick", this.onDependencyDblClick, this, {
            delegate: "." + this.dependencyCls
        });
        if (b.rendered) {
            this.renderAllDependenciesBuffered()
        }
    },
    bindDependencyStore: function (a) {
        a.on({
            datachanged: this.renderAllDependenciesBuffered,
            load: this.renderAllDependenciesBuffered,
            add: this.onDependencyAdd,
            update: this.onDependencyUpdate,
            remove: this.onDependencyDelete,
            scope: this
        });
        this.store = a
    },
    unBindDependencyStore: function () {
        this.store.un({
            datachanged: this.renderAllDependenciesBuffered,
            load: this.renderAllDependenciesBuffered,
            add: this.onDependencyAdd,
            update: this.onDependencyUpdate,
            remove: this.onDependencyDelete,
            scope: this
        })
    },
    bindTaskStore: function (a) {
        var b = this.ganttView;
        if (b.animate) {
            b.on({
                afterexpand: this.renderAllDependenciesBuffered,
                aftercollapse: this.renderAllDependenciesBuffered,
                scope: this
            })
        } else {
            a.on({
                expand: this.renderAllDependenciesBuffered,
                collapse: this.renderAllDependenciesBuffered,
                scope: this
            })
        }
        a.on({
            cascade: this.onTaskStoreCascade,
            "root-fill-start": this.onRootFillStart,
            remove: this.renderAllDependenciesBuffered,
            insert: this.renderAllDependenciesBuffered,
            append: this.renderAllDependenciesBuffered,
            move: this.renderAllDependenciesBuffered,
            update: this.onTaskUpdated,
            scope: this
        });
        this.taskStore = a
    },
    onTaskStoreCascade: function (a, b) {
        if (b && b.nbrAffected > 0) {
            this.renderAllDependenciesBuffered()
        }
    },
    unBindTaskStore: function (a) {
        a = a || this.taskStore;
        var b = this.ganttView;
        if (!a) {
            return
        }
        if (b.animate) {
            b.un({
                afterexpand: this.renderAllDependenciesBuffered,
                aftercollapse: this.renderAllDependenciesBuffered,
                scope: this
            })
        } else {
            a.un({
                expand: this.renderAllDependenciesBuffered,
                collapse: this.renderAllDependenciesBuffered,
                scope: this
            })
        }
        a.un({
            cascade: this.onTaskStoreCascade,
            remove: this.renderAllDependenciesBuffered,
            insert: this.renderAllDependenciesBuffered,
            append: this.renderAllDependenciesBuffered,
            move: this.renderAllDependenciesBuffered,
            "root-fill-start": this.onRootFillStart,
            scope: this
        });
        a.un({
            update: this.onTaskUpdated,
            scope: this
        })
    },
    onRootFillStart: function () {
        var a = this.taskStore;
        this.unBindTaskStore(a);
        this.taskStore.on("root-fill-end", function () {
            this.bindTaskStore(a)
        }, this, {
            single: true
        })
    },
    onDependencyDblClick: function (b, a) {
        var c = this.getRecordForDependencyEl(a);
        this.fireEvent("dependencydblclick", this, c, b, a)
    },
    highlightDependency: function (a) {
        if (!(a instanceof Ext.data.Model)) {
            a = this.getDependencyRecordByInternalId(a)
        }
        this.getElementsForDependency(a).addCls(this.selectedCls)
    },
    unhighlightDependency: function (a) {
        if (!(a instanceof Ext.data.Model)) {
            a = this.getDependencyRecordByInternalId(a)
        }
        this.getElementsForDependency(a).removeCls(this.selectedCls)
    },
    getElementsForDependency: function (a) {
        var b = a instanceof Ext.data.Model ? a.internalId : a;
        return this.containerEl.select(".sch-dep-" + b)
    },
    depRe: new RegExp("sch-dep-([^\\s]+)"),
    getDependencyRecordByInternalId: function (d) {
        var c, b, a;
        for (b = 0, a = this.store.getCount(); b < a; b++) {
            c = this.store.getAt(b);
            if (c.internalId == d) {
                return c
            }
        }
        return null
    },
    getRecordForDependencyEl: function (c) {
        var a = c.className.match(this.depRe),
            d = null;
        if (a && a[1]) {
            var b = a[1];
            d = this.getDependencyRecordByInternalId(b)
        }
        return d
    },
    renderAllDependenciesBuffered: function () {
        var a = this;
        this.containerEl.update("");
        setTimeout(function () {
            if (!a.ganttView.isDestroyed) {
                a.renderAllDependencies()
            }
        }, 0)
    },
    renderAllDependencies: function () {
        if (!this.containerEl.dom) {
            return
        }
        this.getDependencyElements().remove();
        this.renderDependencies(this.store.data.items)
    },
    getDependencyElements: function () {
        return this.containerEl.select("." + this.dependencyCls)
    },
    renderDependencies: function (b) {
        if (b) {
            var a = this.painter.getDependencyTplData(b);
            this.lineTpl[Ext.isIE ? "insertFirst" : "append"](this.containerEl, a)
        }
    },
    renderTaskDependencies: function (d) {
        var c = [];
        if (!Ext.isArray(d)) {
            d = [d]
        }
        for (var a = 0, b = d.length; a < b; a++) {
            c = c.concat(d[a].getAllDependencies())
        }
        this.renderDependencies(c)
    },
    onDependencyUpdate: function (b, a) {
        this.removeDependencyElements(a, false);
        this.renderDependencies(a)
    },
    onDependencyAdd: function (a, b) {
        this.renderDependencies(b)
    },
    removeDependencyElements: function (a, b) {
        if (b !== false) {
            this.getElementsForDependency(a).fadeOut({
                remove: true
            })
        } else {
            this.getElementsForDependency(a).remove()
        }
    },
    onDependencyDelete: function (b, a) {
        this.removeDependencyElements(a)
    },
    dimEventDependencies: function (a) {
        this.containerEl.select(this.depRe + a).setOpacity(0.2)
    },
    clearSelectedDependencies: function () {
        this.containerEl.select("." + this.selectedCls).removeCls(this.selectedCls)
    },
    onTaskUpdated: function (c, b, a) {
        if (!this.taskStore.cascading && a != Ext.data.Model.COMMIT && (!b.previous || b.startDateField in b.previous || b.endDateField in b.previous)) {
            this.updateDependencies(b)
        }
    },
    updateDependencies: function (b) {
        if (!Ext.isArray(b)) {
            b = [b]
        }
        var a = this;
        Ext.each(b, function (c) {
            Ext.each(c.getAllDependencies(), function (d) {
                a.removeDependencyElements(d, false)
            })
        });
        this.renderTaskDependencies(b)
    },
    onDependencyDrop: function (e, c, b, d) {
        var a = new this.store.model({
            fromTask: c,
            toTask: b,
            type: d
        });
        if (this.store.isValidDependency(a)) {
            this.store.add(a)
        }
    },
    destroy: function () {
        if (this.dnd) {
            this.dnd.destroy()
        }
        this.unBindTaskStore();
        this.unBindDependencyStore()
    }
});
Ext.define("Gnt.view.Gantt", {
    extend: "Sch.view.TimelineTreeView",
    alias: ["widget.ganttview"],
    requires: ["Gnt.view.Dependency", "Gnt.model.Task", "Gnt.template.Task", "Gnt.template.ParentTask", "Gnt.template.Milestone", "Gnt.feature.TaskDragDrop", "Gnt.feature.ProgressBarResize", "Gnt.feature.TaskResize", "Sch.view.Horizontal"],
    uses: ["Gnt.feature.LabelEditor", "Gnt.feature.DragCreator"],
    _cmpCls: "sch-ganttview",
    rowHeight: 22,
    barMargin: 4,
    scheduledEventName: "task",
    trackOver: false,
    toggleOnDblClick: false,
    milestoneOffset: 8,
    parentTaskOffset: 6,
    eventSelector: ".sch-gantt-item",
    eventWrapSelector: ".sch-event-wrap",
    progressBarResizer: null,
    taskResizer: null,
    taskDragDrop: null,
    dragCreator: null,
    dependencyView: null,
    resizeConfig: null,
    dragDropConfig: null,
    constructor: function (a) {
        var b = a.panel._top;
        Ext.apply(this, {
            taskStore: b.taskStore,
            dependencyStore: b.dependencyStore,
            enableDependencyDragDrop: b.enableDependencyDragDrop,
            enableTaskDragDrop: b.enableTaskDragDrop,
            enableProgressBarResize: b.enableProgressBarResize,
            enableDragCreation: b.enableDragCreation,
            allowParentTaskMove: b.allowParentTaskMove,
            toggleParentTasksOnClick: b.toggleParentTasksOnClick,
            resizeHandles: b.resizeHandles,
            enableBaseline: b.baselineVisible || b.enableBaseline,
            leftLabelField: b.leftLabelField,
            rightLabelField: b.rightLabelField,
            eventTemplate: b.eventTemplate,
            parentEventTemplate: b.parentEventTemplate,
            milestoneTemplate: b.milestoneTemplate,
            resizeConfig: b.resizeConfig,
            dragDropConfig: b.dragDropConfig
        });
        this.addEvents("taskclick", "taskdblclick", "taskcontextmenu", "beforetaskresize", "taskresizestart", "partialtaskresize", "aftertaskresize", "beforeprogressbarresize", "progressbarresizestart", "afterprogressbarresize", "beforetaskdrag", "taskdragstart", "taskdrop", "aftertaskdrop", "labeledit_beforestartedit", "labeledit_beforecomplete", "labeledit_complete", "beforedependencydrag", "dependencydragstart", "dependencydrop", "afterdependencydragdrop");
        this.callParent(arguments)
    },
    initComponent: function () {
        this.configureLabels();
        this.setupGanttEvents();
        this.callParent(arguments);
        this.setupTemplates()
    },
    getDependencyStore: function () {
        return this.dependencyStore
    },
    configureFeatures: function () {
        if (this.enableProgressBarResize !== false) {
            this.progressBarResizer = Ext.create("Gnt.feature.ProgressBarResize", {
                gantt: this
            });
            this.on({
                beforeprogressbarresize: this.onBeforeTaskProgressBarResize,
                progressbarresizestart: this.onTaskProgressBarResizeStart,
                afterprogressbarresize: this.onTaskProgressBarResizeEnd,
                scope: this
            })
        }
        if (this.resizeHandles !== "none") {
            this.taskResizer = Ext.create("Gnt.feature.TaskResize", Ext.apply({
                gantt: this,
                validatorFn: this.resizeValidatorFn || Ext.emptyFn,
                validatorFnScope: this.validatorFnScope || this
            }, this.resizeConfig || {}));
            this.on({
                beforedragcreate: this.onBeforeDragCreate,
                beforetaskresize: this.onBeforeTaskResize,
                taskresizestart: this.onTaskResizeStart,
                aftertaskresize: this.onTaskResizeEnd,
                scope: this
            })
        }
        if (this.enableTaskDragDrop) {
            this.taskDragDrop = Ext.create("Gnt.feature.TaskDragDrop", Ext.apply({
                gantt: this,
                validatorFn: this.dndValidatorFn || Ext.emptyFn,
                validatorFnScope: this.validatorFnScope || this
            }, this.dragDropConfig));
            this.on({
                beforetaskdrag: this.onBeforeTaskDrag,
                taskdragstart: this.onDragDropStart,
                aftertaskdrop: this.onDragDropEnd,
                scope: this
            })
        }
        if (this.enableDragCreation) {
            this.dragCreator = Ext.create("Gnt.feature.DragCreator", Ext.apply({
                ganttView: this
            }))
        }
    },
    prepareData: function (d, a, b) {
        var c = this,
            e = {}, f = c.gridDataColumns || c.getGridColumns();
        e[f[0].id] = this.renderTask(b);
        return e
    },
    renderTask: function (k) {
        var l = k.getStartDate(),
            n = this.timeAxis,
            s = Sch.util.Date,
            b = {}, A = "",
            h = n.getStart(),
            g = n.getEnd(),
            C = k.isMilestone(),
            x = k.isLeaf(),
            o, q, u;
        if (l) {
            var v = k.getEndDate() || Sch.util.Date.add(l, Sch.util.Date.DAY, 1),
                e = Sch.util.Date.intersectSpans(l, v, h, g);
            if (e) {
                u = v > g;
                q = s.betweenLesser(l, h, g);
                var z = Math.floor(this.getXYFromDate(q ? l : h)[0]),
                    d = Math.floor(this.getXYFromDate(u ? g : v)[0]),
                    f = C ? 0 : d - z;
                if (!C && !x) {
                    if (u) {
                        f += this.parentTaskOffset
                    } else {
                        f += 2 * this.parentTaskOffset
                    }
                }
                b = {
                    id: k.internalId,
                    leftOffset: C ? (d || z) : z,
                    width: Math.max(1, f),
                    percentDone: Math.min(k.getPercentDone() || 0, 100)
                };
                o = this.eventRenderer.call(this.eventRendererScope || this, k, b, k.store) || {};
                var t = this.leftLabelField,
                    j = this.rightLabelField,
                    B;
                if (t) {
                    b.leftLabel = t.renderer.call(t.scope || this, k.data[t.dataIndex], k)
                }
                if (j) {
                    b.rightLabel = j.renderer.call(j.scope || this, k.data[j.dataIndex], k)
                }
                Ext.apply(b, o);
                if (C) {
                    B = this.milestoneTemplate
                } else {
                    b.width = Math.max(1, f);
                    var p = "";
                    if (u) {
                        p = " sch-event-endsoutside "
                    }
                    if (!q) {
                        p = " sch-event-startsoutside "
                    }
                    b.ctcls = (b.ctcls || "") + p;
                    B = this[x ? "eventTemplate" : "parentEventTemplate"]
                }
                var i = " sch-event-resizable-" + k.getResizable();
                if (k.dirty) {
                    i += " sch-dirty "
                }
                if (k.isDraggable() === false) {
                    i += " sch-event-fixed "
                }
                b.cls = (b.cls || "") + (k.getCls() || "") + i;
                A += B.apply(b)
            }
        }
        if (this.enableBaseline) {
            var r = k.getBaselineStartDate(),
                a = k.getBaselineEndDate();
            if (!o) {
                o = this.eventRenderer.call(this, k, b, k.store) || {}
            }
            if (r && a) {
                u = a > g;
                q = s.betweenLesser(r, h, g);
                var c = k.isBaselineMilestone(),
                    w = c ? this.baselineMilestoneTemplate : (k.isLeaf() ? this.baselineTaskTemplate : this.baselineParentTaskTemplate),
                    m = Math.floor(this.getXYFromDate(q ? r : h)[0]),
                    y = c ? 0 : Math.floor(this.getXYFromDate(u ? g : a)[0]) - m;
                A += w.apply({
                    basecls: o.basecls || "",
                    id: k.internalId + "-base",
                    percentDone: k.getBaselinePercentDone(),
                    leftOffset: m,
                    width: Math.max(1, y)
                })
            }
        }
        return A
    },
    setupTemplates: function () {
        var a = {
            leftLabel: !! this.leftLabelField,
            rightLabel: !! this.rightLabelField,
            prefix: this.eventPrefix,
            enableDependencyDragDrop: this.enableDependencyDragDrop !== false,
            resizeHandles: this.resizeHandles,
            enableProgressBarResize: this.enableProgressBarResize
        };
        if (!this.eventTemplate) {
            a.baseCls = "sch-gantt-task {ctcls}";
            this.eventTemplate = Ext.create("Gnt.template.Task", a)
        }
        if (!this.parentEventTemplate) {
            a.baseCls = "sch-gantt-parent-task {ctcls}";
            this.parentEventTemplate = Ext.create("Gnt.template.ParentTask", a)
        }
        if (!this.milestoneTemplate) {
            a.baseCls = "sch-gantt-milestone {ctcls}";
            this.milestoneTemplate = Ext.create("Gnt.template.Milestone", a)
        }
        if (this.enableBaseline) {
            a = {
                prefix: this.eventPrefix
            };
            if (!this.baselineTaskTemplate) {
                a.baseCls = "sch-gantt-task-baseline sch-gantt-baseline-item {basecls}";
                this.baselineTaskTemplate = Ext.create("Gnt.template.Task", a)
            }
            if (!this.baselineParentTaskTemplate) {
                a.baseCls = "sch-gantt-parenttask-baseline sch-gantt-baseline-item {basecls}";
                this.baselineParentTaskTemplate = Ext.create("Gnt.template.ParentTask", a)
            }
            if (!this.baselineMilestoneTemplate) {
                a.baseCls = "sch-gantt-milestone-baseline sch-gantt-baseline-item {basecls}";
                this.baselineMilestoneTemplate = Ext.create("Gnt.template.Milestone", a)
            }
        }
    },
    getDependencyView: function () {
        return this.dependencyView
    },
    getTaskStore: function () {
        return this.taskStore
    },
    initDependencies: function () {
        if (this.dependencyStore) {
            var b = this,
                a = Ext.create("Gnt.view.Dependency", {
                    containerEl: b.el,
                    ganttView: b,
                    enableDependencyDragDrop: b.enableDependencyDragDrop,
                    store: b.dependencyStore
                });
            a.on({
                beforednd: b.onBeforeDependencyDrag,
                dndstart: b.onDependencyDragStart,
                drop: b.onDependencyDrop,
                afterdnd: b.onAfterDependencyDragDrop,
                beforecascade: b.onBeforeCascade,
                cascade: b.onCascade,
                scope: b
            });
            b.dependencyView = a;
            b.relayEvents(a, ["dependencydblclick"])
        }
    },
    setupGanttEvents: function () {
        var a = this.getSelectionModel();
        if (this.toggleParentTasksOnClick) {
            this.on({
                taskclick: function (c, b) {
                    if (!b.isLeaf()) {
                        this.toggle(b)
                    }
                },
                scope: this
            })
        }
    },
    configureLabels: function () {
        var c = {
            renderer: function (d) {
                return d
            },
            dataIndex: undefined
        };
        var b = this.leftLabelField;
        if (b) {
            if (Ext.isString(b)) {
                b = this.leftLabelField = {
                    dataIndex: b
                }
            }
            Ext.applyIf(b, c);
            if (b.editor) {
                b.editor = Ext.create("Gnt.feature.LabelEditor", this, {
                    alignment: "r-r",
                    delegate: ".sch-gantt-label-left",
                    labelPosition: "left",
                    field: b.editor,
                    dataIndex: b.dataIndex
                })
            }
        }
        var a = this.rightLabelField;
        if (a) {
            if (Ext.isString(a)) {
                a = this.rightLabelField = {
                    dataIndex: a
                }
            }
            Ext.applyIf(a, c);
            if (a.editor) {
                a.editor = Ext.create("Gnt.feature.LabelEditor", this, {
                    alignment: "l-l",
                    delegate: ".sch-gantt-label-right",
                    labelPosition: "right",
                    field: a.editor,
                    dataIndex: a.dataIndex
                })
            }
        }
        this.on("labeledit_beforestartedit", this.onBeforeLabelEdit, this)
    },
    onBeforeTaskDrag: function (b, a) {
        return !this.readOnly && (this.allowParentTaskMove || a.isLeaf())
    },
    onDragDropStart: function () {
        if (this.tip) {
            this.tip.disable()
        }
    },
    onDragDropEnd: function () {
        if (this.tip) {
            this.tip.enable()
        }
    },
    onTaskProgressBarResizeStart: function () {
        if (this.tip) {
            this.tip.hide();
            this.tip.disable()
        }
    },
    onTaskProgressBarResizeEnd: function () {
        if (this.tip) {
            this.tip.enable()
        }
    },
    onTaskResizeStart: function () {
        if (this.tip) {
            this.tip.hide();
            this.tip.disable()
        }
    },
    onTaskResizeEnd: function () {
        if (this.tip) {
            this.tip.enable()
        }
    },
    onBeforeDragCreate: function () {
        return !this.readOnly
    },
    onBeforeTaskResize: function (a, b) {
        return !this.readOnly && b.getSchedulingMode() !== "EffortDriven"
    },
    onBeforeTaskProgressBarResize: function () {
        return !this.readOnly
    },
    onBeforeLabelEdit: function () {
        return !this.readOnly
    },
    onBeforeEdit: function () {
        return !this.readOnly
    },
    beforeRender: function () {
        this.addCls("sch-ganttview");
        this.callParent(arguments)
    },
    afterRender: function () {
        this.initDependencies();
        this.callParent(arguments);
        this.el.on("mousemove", this.configureFeatures, this, {
            single: true
        })
    },
    resolveTaskRecord: function (a) {
        var b = this.findItemByChild(a);
        if (b) {
            return this.getRecord(this.findItemByChild(a))
        }
        return null
    },
    resolveEventRecord: function (a) {
        return this.resolveTaskRecord(a)
    },
    highlightTask: function (b, a) {
        if (!(b instanceof Ext.data.Model)) {
            b = this.taskStore.getById(b)
        }
        if (b) {
            var d = this.getNode(b);
            if (d) {
                Ext.fly(d).addCls("sch-gantt-task-highlighted")
            }
            var c = b.getId() || b.internalId;
            if (a !== false) {
                this.dependencyStore.each(function (e) {
                    if (e.getSourceId() == c) {
                        this.highlightDependency(e.id);
                        this.highlightTask(e.getTargetId(), a)
                    }
                }, this)
            }
        }
    },
    unhighlightTask: function (a, c) {
        if (!(a instanceof Ext.data.Model)) {
            a = this.taskStore.getById(a)
        }
        if (a) {
            Ext.fly(this.getNode(a)).removeCls("sch-gantt-task-highlighted");
            var b = a.getId() || a.internalId;
            if (c !== false) {
                this.dependencyStore.each(function (d) {
                    if (d.getSourceId() == b) {
                        this.unhighlightDependency(d.id);
                        this.unhighlightTask(d.getTargetId(), c)
                    }
                }, this)
            }
        }
    },
    clearSelectedTasksAndDependencies: function () {
        this.getSelectionModel().deselectAll();
        this.getDependencyView().clearSelectedDependencies();
        this.el.select("tr.sch-gantt-task-highlighted").removeCls("sch-gantt-task-highlighted")
    },
    getCriticalPaths: function () {
        return this.taskStore.getCriticalPaths()
    },
    highlightCriticalPaths: function () {
        this.clearSelectedTasksAndDependencies();
        var g = this.getCriticalPaths(),
            c = this.getDependencyView(),
            f = this.dependencyStore,
            e, d, b, a;
        Ext.each(g, function (h) {
            for (d = 0, b = h.length; d < b; d++) {
                e = h[d];
                this.highlightTask(e, false);
                if (d < (b - 1)) {
                    a = f.getAt(f.findBy(function (i) {
                        return i.getTargetId() === (e.getId() || e.internalId) && i.getSourceId() === (h[d + 1].getId() || h[d + 1].internalId)
                    }));
                    c.highlightDependency(a)
                }
            }
        }, this);
        this.addCls("sch-gantt-critical-chain");
        this.getSelectionModel().setLocked(true)
    },
    unhighlightCriticalPaths: function () {
        this.el.removeCls("sch-gantt-critical-chain");
        this.getSelectionModel().setLocked(false);
        this.clearSelectedTasksAndDependencies()
    },
    getXOffset: function (a) {
        var b = 0;
        if (a.isMilestone()) {
            b = this.milestoneOffset
        } else {
            if (!a.isLeaf()) {
                b = this.parentTaskOffset
            }
        }
        return b
    },
    onDestroy: function () {
        if (this.dependencyView) {
            this.dependencyView.destroy()
        }
        this.callParent(arguments)
    },
    highlightDependency: function (a) {
        this.dependencyView.highlightDependency(a)
    },
    unhighlightDependency: function (a) {
        this.dependencyView.unhighlightDependency(a)
    },
    onBeforeDependencyDrag: function (b, a) {
        return this.fireEvent("beforedependencydrag", this, a)
    },
    onDependencyDragStart: function (a) {
        this.fireEvent("dependencydragstart", this);
        if (this.tip) {
            this.tip.disable()
        }
    },
    onDependencyDrop: function (b, c, a, d) {
        this.fireEvent("dependencydrop", this, this.taskStore.getNodeById(c), this.taskStore.getById(a), d)
    },
    onAfterDependencyDragDrop: function () {
        this.fireEvent("afterdependencydragdrop", this);
        if (this.tip) {
            this.tip.enable()
        }
    },
    onBeforeCascade: function (a, b) {
        this.taskStore.un("update", this.onUpdate, this)
    },
    onCascade: function (a, b) {
        this.taskStore.on("update", this.onUpdate, this)
    },
    onUpdate: function (c, a, b, d) {
        if (d && d.length === 1 && d[0] === "expanded") {
            return
        }
        this.callParent(arguments)
    },
    getLeftEditor: function () {
        return this.leftLabelField.editor
    },
    getRightEditor: function () {
        return this.rightLabelField.editor
    },
    editLeftLabel: function (a) {
        var b = this.leftLabelField && this.getLeftEditor();
        if (b) {
            b.edit(a)
        }
    },
    editRightLabel: function (a) {
        var b = this.rightLabelField && this.getRightEditor();
        if (b) {
            b.edit(a)
        }
    },
    getOuterElementFromEventRecord: function (a) {
        var b = this.callParent([a]);
        return b && b.up(this.eventWrapSelector) || null
    },
    getDependenciesForTask: function (a) {
        console.warn("`ganttPanel.getDependenciesForTask()` is deprecated, use `task.getAllDependencies()` instead");
        return a.getAllDependencies()
    },
    setNewTemplate: function () {
        var b = this,
            a = b.headerCt.getColumnsForTpl(true);
        b.tpl = b.getTableChunker().getTableTpl({
            columns: [a[0]],
            features: b.features
        })
    }
});
Ext.define("Gnt.panel.Gantt", {
    extend: "Sch.panel.TimelineTreePanel",
    alias: ["widget.ganttpanel"],
    alternateClassName: ["Sch.gantt.GanttPanel"],
    requires: ["Gnt.view.Gantt", "Gnt.model.Dependency", "Gnt.data.ResourceStore", "Gnt.data.AssignmentStore", "Gnt.feature.WorkingTime", "Gnt.data.Calendar", "Gnt.data.TaskStore", "Gnt.data.DependencyStore"],
    uses: ["Sch.plugin.CurrentTimeLine"],
    lockedXType: "treepanel",
    normalXType: "ganttpanel",
    viewType: "ganttview",
    syncRowHeight: false,
    layout: "border",
    lightWeight: true,
    leftLabelField: null,
    rightLabelField: null,
    highlightWeekends: true,
    weekendsAreWorkdays: false,
    skipWeekendsDuringDragDrop: true,
    enableTaskDragDrop: true,
    enableDependencyDragDrop: true,
    enableProgressBarResize: false,
    toggleParentTasksOnClick: true,
    addRowOnTab: true,
    recalculateParents: true,
    cascadeChanges: false,
    showTodayLine: false,
    enableBaseline: false,
    baselineVisible: false,
    enableAnimations: false,
    workingTimePlugin: null,
    todayLinePlugin: null,
    allowParentTaskMove: false,
    enableDragCreation: true,
    eventRenderer: Ext.emptyFn,
    eventRendererScope: null,
    eventTemplate: null,
    parentEventTemplate: null,
    milestoneTemplate: null,
    autoHeight: null,
    calendar: null,
    taskStore: null,
    dependencyStore: null,
    resourceStore: null,
    assignmentStore: null,
    columnLines: false,
    dndValidatorFn: Ext.emptyFn,
    resizeHandles: "both",
    resizeValidatorFn: Ext.emptyFn,
    resizeConfig: null,
    dragDropConfig: null,
    initStores: function () {
        var a = Ext.StoreMgr.lookup(this.taskStore || this.store);
        if (!a) {
            Ext.Error.raise("You must specify a taskStore config")
        }
        if (!(a instanceof Gnt.data.TaskStore)) {
            Ext.Error.raise("A `taskStore` should be an instance of `Gnt.data.TaskStore` (or of a subclass)")
        }
        Ext.apply(this, {
            store: a,
            taskStore: a
        });
        var d = this.calendar = a.calendar;
        if (this.needToTranslateOption("weekendsAreWorkdays")) {
            d.setWeekendsAreWorkDays(this.weekendsAreWorkdays)
        }
        if (a.dependencyStore) {
            this.dependencyStore = a.dependencyStore
        } else {
            if (this.dependencyStore) {
                this.dependencyStore = Ext.StoreMgr.lookup(this.dependencyStore);
                a.setDependencyStore(this.dependencyStore)
            } else {
                this.dependencyStore = Ext.create("Gnt.data.DependencyStore");
                a.setDependencyStore(this.dependencyStore)
            }
        }
        if (!(this.dependencyStore instanceof Gnt.data.DependencyStore)) {
            Ext.Error.raise("The Gantt dependency store should be a Gnt.data.DependencyStore, or a subclass thereof.")
        }
        var b;
        if (a.getResourceStore()) {
            b = a.getResourceStore()
        } else {
            if (this.resourceStore) {
                b = Ext.StoreMgr.lookup(this.resourceStore)
            } else {
                b = Ext.create("Gnt.data.ResourceStore")
            }
        }
        if (!(b instanceof Gnt.data.ResourceStore)) {
            Ext.Error.raise("A `ResourceStore` should be an instance of `Gnt.data.ResourceStore` (or of a subclass)")
        }
        var c;
        if (a.getAssignmentStore()) {
            c = a.getAssignmentStore()
        } else {
            if (this.assignmentStore) {
                c = Ext.StoreMgr.lookup(this.assignmentStore)
            } else {
                c = Ext.create("Gnt.data.AssignmentStore")
            }
        }
        if (!(c instanceof Gnt.data.AssignmentStore)) {
            Ext.Error.raise("An `assignmentStore` should be an instance of `Gnt.data.AssignmentStore` (or of a subclass)")
        }
        if (this.lockable) {
            this.bindAssignmentStore(c, true);
            this.bindResourceStore(b, true)
        }
    },
    initComponent: function () {
        if (Ext.isBoolean(this.showBaseline)) {
            this.enableBaseline = this.baselineVisible = this.showBaseline;
            this.showBaseline = Gnt.panel.Gantt.prototype.showBaseline
        }
        this.autoHeight = false;
        this.initStores();
        if (this.needToTranslateOption("cascadeChanges")) {
            this.setCascadeChanges(this.cascadeChanges)
        }
        if (this.needToTranslateOption("recalculateParents")) {
            this.setRecalculateParents(this.recalculateParents)
        }
        if (this.needToTranslateOption("skipWeekendsDuringDragDrop")) {
            this.setSkipWeekendsDuringDragDrop(this.skipWeekendsDuringDragDrop)
        }
        if (this.lockable) {
            this.lockedGridConfig = this.lockedGridConfig || {};
            Ext.apply(this.lockedGridConfig, {
                columnLines: true,
                rowLines: true
            });
            this.configureFunctionality()
        }
        this.callParent(arguments);
        var a = this.getSchedulingView();
        this.relayEvents(a, ["taskclick", "taskdblclick", "taskcontextmenu", "beforetaskresize", "taskresizestart", "partialtaskresize", "aftertaskresize", "beforeprogressbarresize", "progressbarresizestart", "afterprogressbarresize", "beforetaskdrag", "taskdragstart", "taskdrop", "aftertaskdrop", "labeledit_beforestartedit", "labeledit_beforecomplete", "labeledit_complete", "beforedependencydrag", "dependencydragstart", "dependencydrop", "afterdependencydragdrop", "dependencydblclick"]);
        if (this.lockable) {
            this.bodyCls = (this.bodyCls || "") + " sch-ganttpanel-container-body";
            a.store.calendar = this.calendar;
            this.fixSelectionModel();
            if (this.addRowOnTab) {
                var b = this.lockedGrid,
                    c = this.getSelectionModel();
                c.onEditorTab = Ext.Function.createInterceptor(c.onEditorTab, function (h, i) {
                    var g = b.view,
                        f = h.getActiveRecord(),
                        j = h.getActiveColumn(),
                        d = g.getPosition(f, j);
                    if (d.column === b.headerCt.getColumnCount() - 1 && d.row === b.view.store.getCount() - 1) {
                        f.addTaskBelow({
                            leaf: true
                        })
                    }
                })
            }
        }
    },
    needToTranslateOption: function (a) {
        return this.hasOwnProperty(a) || this.self.prototype.hasOwnProperty(a) && this.self != Gnt.panel.Gantt
    },
    fixSelectionModel: function () {
        var a = this.getSelectionModel();
        var d = this.lockedGrid.getView();
        var c = this.normalGrid.getView();
        d.__lockedType = "locked";
        c.__lockedType = "normal";
        var e = d.onAdd;
        d.onAdd = function () {
            a.__preventUpdateOf = "normal";
            e.apply(this, arguments);
            delete a.__preventUpdateOf
        };
        var b = c.onAdd;
        c.onAdd = function () {
            a.__preventUpdateOf = "locked";
            b.apply(this, arguments);
            delete a.__preventUpdateOf
        };
        var f = d.store;
        d.bindStore(null);
        c.bindStore(null);
        d.bindStore(f);
        c.bindStore(f);
        Ext.apply(a, {
            onSelectChange: function (m, j, q, g) {
                var o = this,
                    r = o.views,
                    k = r.length,
                    p = o.store,
                    h = p.indexOf(m),
                    n = j ? "select" : "deselect",
                    l = 0;
                if ((q || o.fireEvent("before" + n, o, m, h)) !== false && g() !== false) {
                    for (; l < k; l++) {
                        if (!this.__preventUpdateOf || r[l].__lockedType != this.__preventUpdateOf) {
                            if (j) {
                                r[l].onRowSelect(h, q)
                            } else {
                                r[l].onRowDeselect(h, q)
                            }
                        }
                    }
                    if (!q) {
                        o.fireEvent(n, o, m, h)
                    }
                }
            }
        })
    },
    getDependencyView: function () {
        return this.getSchedulingView().getDependencyView()
    },
    disableWeekendHighlighting: function (a) {
        this.workingTimePlugin.setDisabled(a)
    },
    resolveTaskRecord: function (a) {
        return this.getSchedulingView().resolveTaskRecord(a)
    },
    fitTimeColumns: function () {
        this.getSchedulingView().fitColumns()
    },
    getResourceStore: function () {
        return this.getTaskStore().getResourceStore()
    },
    getAssignmentStore: function () {
        return this.getTaskStore().getAssignmentStore()
    },
    getTaskStore: function () {
        return this.taskStore
    },
    getDependencyStore: function () {
        return this.dependencyStore
    },
    onDragDropStart: function () {
        if (this.tip) {
            this.tip.hide();
            this.tip.disable()
        }
    },
    onDragDropEnd: function () {
        if (this.tip) {
            this.tip.enable()
        }
    },
    configureFunctionality: function () {
        var a = this.plugins = [].concat(this.plugins || []);
        if (this.highlightWeekends) {
            this.workingTimePlugin = Ext.create("Gnt.feature.WorkingTime", {
                calendar: this.calendar
            });
            a.push(this.workingTimePlugin)
        }
        if (this.showTodayLine) {
            this.todayLinePlugin = new Sch.plugin.CurrentTimeLine();
            a.push(this.todayLinePlugin)
        }
    },
    beforeRender: function () {
        if (this.lockable) {
            var a = " sch-ganttpanel sch-horizontal ";
            if (this.highlightWeekends) {
                a += " sch-ganttpanel-highlightweekends "
            }
            this.addCls(a);
            if (this.baselineVisible) {
                this.showBaseline()
            }
        }
        this.callParent(arguments)
    },
    afterRender: function () {
        this.callParent(arguments);
        if (this.lockable) {
            this.applyPatches()
        }
    },
    showBaseline: function () {
        this.addCls("sch-ganttpanel-showbaseline")
    },
    hideBaseline: function () {
        this.removeCls("sch-ganttpanel-showbaseline")
    },
    toggleBaseline: function () {
        this.toggleCls("sch-ganttpanel-showbaseline")
    },
    zoomToFit: function () {
        var a = this.taskStore.getTotalTimeSpan();
        if (a.start && a.end && a.start < a.end) {
            this.setTimeSpan(a.start, a.end);
            this.fitTimeColumns()
        }
    },
    getCascadeChanges: function () {
        return this.taskStore.cascadeChanges
    },
    setCascadeChanges: function (a) {
        this.taskStore.cascadeChanges = a
    },
    getRecalculateParents: function () {
        return this.taskStore.recalculateParents
    },
    setRecalculateParents: function (a) {
        this.taskStore.recalculateParents = a
    },
    setSkipWeekendsDuringDragDrop: function (a) {
        this.taskStore.skipWeekendsDuringDragDrop = this.skipWeekendsDuringDragDrop = a
    },
    getSkipWeekendsDuringDragDrop: function () {
        return this.taskStore.skipWeekendsDuringDragDrop
    },
    applyPatches: function () {
        if (Ext.tree.plugin && Ext.tree.plugin.TreeViewDragDrop) {
            var a;
            Ext.each(this.lockedGrid.getView().plugins, function (b) {
                if (b instanceof Ext.tree.plugin.TreeViewDragDrop) {
                    a = b;
                    return false
                }
            });
            if (!a || !a.dropZone) {
                return
            }
            a.dropZone.handleNodeDrop = function (e, l, f) {
                var n = this,
                    o = n.view,
                    g = l.parentNode,
                    p = o.getStore(),
                    r = [],
                    b, d, k, c, j, m, q, h;
                if (e.copy) {
                    b = e.records;
                    e.records = [];
                    for (d = 0, k = b.length; d < k; d++) {
                        e.records.push(Ext.apply({}, b[d].data))
                    }
                }
                n.cancelExpand();
                if (f == "before") {
                    c = g.insertBefore;
                    j = [null, l];
                    l = g
                } else {
                    if (f == "after") {
                        if (l.nextSibling) {
                            c = g.insertBefore;
                            j = [null, l.nextSibling]
                        } else {
                            c = g.appendChild;
                            j = [null]
                        }
                        l = g
                    } else {
                        if (!l.isExpanded()) {
                            m = true
                        }
                        c = l.appendChild;
                        j = [null]
                    }
                }
                q = function () {
                    var i;
                    for (d = 0, k = e.records.length; d < k; d++) {
                        j[0] = e.records[d];
                        j[0].isMove = true;
                        i = c.apply(l, j);
                        delete j[0].isMove;
                        if (Ext.enableFx && n.dropHighlight) {
                            r.push(o.getNode(i))
                        }
                    }
                    if (Ext.enableFx && n.dropHighlight) {
                        Ext.Array.forEach(r, function (s) {
                            if (s) {
                                Ext.fly(s.firstChild ? s.firstChild : s).highlight(n.dropHighlightColor)
                            }
                        })
                    }
                };
                if (m) {
                    l.expand(false, q)
                } else {
                    q()
                }
            }
        }
    },
    bindResourceStore: function (c, a) {
        var b = this;
        if (!a && b.resourceStore) {
            if (c !== b.resourceStore && b.resourceStore.autoDestroy) {
                b.resourceStore.destroy()
            } else {
                b.mun(b.resourceStore, {
                    scope: b,
                    datachanged: b.onResourceStoreDataChanged
                })
            }
            if (!c) {
                b.resourceStore = null
            }
        }
        if (c) {
            c = Ext.data.StoreManager.lookup(c);
            b.mon(c, {
                scope: b,
                datachanged: b.onResourceStoreDataChanged
            });
            this.taskStore.setResourceStore(c)
        }
        b.resourceStore = c;
        if (c && !a) {
            b.getView().refreshKeepingScroll()
        }
    },
    bindAssignmentStore: function (c, a) {
        var b = this;
        if (!a && b.assignmentStore) {
            if (c !== b.assignmentStore && b.assignmentStore.autoDestroy) {
                b.assignmentStore.destroy()
            } else {
                b.mun(b.assignmentStore, {
                    scope: b,
                    datachanged: b.onAssignmentStoreDataChanged
                })
            }
            if (!c) {
                b.assignmentStore = null
            }
        }
        if (c) {
            c = Ext.data.StoreManager.lookup(c);
            b.mon(c, {
                scope: b,
                datachanged: b.onAssignmentStoreDataChanged
            });
            this.taskStore.setAssignmentStore(c)
        }
        b.assignmentStore = c;
        if (c && !a) {
            b.getView().refreshKeepingScroll()
        }
    },
    onResourceStoreDataChanged: function () {
        this.getView().refreshKeepingScroll()
    },
    onAssignmentStoreDataChanged: function () {
        this.getView().refreshKeepingScroll()
    }
});
Ext.define("Gnt.column.EndDate", {
    extend: "Ext.grid.column.Date",
    alias: "widget.enddatecolumn",
    requires: ["Ext.grid.CellEditor"],
    text: "Finish",
    width: 100,
    align: "left",
    task: null,
    editorFormat: null,
    constructor: function (a) {
        a = a || {};
        var b = a.field || a.editor;
        delete a.field;
        delete a.editor;
        this.field = Ext.create("Ext.grid.CellEditor", {
            ignoreNoChange: true,
            field: b || {
                xtype: "datefield",
                format: a.editorFormat || a.format || this.format || Ext.Date.defaultFormat
            },
            listeners: {
                beforecomplete: this.onBeforeEditComplete,
                scope: this
            }
        });
        this.callParent([a]);
        this.scope = this;
        this.renderer = a.renderer || this.rendererFunc;
        this.editorFormat = this.editorFormat || this.format
    },
    beforeRender: function () {
        if (!this.dataIndex) {
            var a = this.up("treepanel");
            this.dataIndex = a.store.model.prototype.endDateField
        }
        this.callParent(arguments)
    },
    rendererFunc: function (b, c, a) {
        if (!b) {
            return
        }
        if (!a.isEditable(this.dataIndex)) {
            c.tdCls = (c.tdCls || "") + " sch-column-readonly"
        }
        if (a.getEndDate() > a.getStartDate() && b - Ext.Date.clearTime(b, true) === 0 && !Ext.Date.formatContainsHourInfo(this.format)) {
            b = Sch.util.Date.add(b, Sch.util.Date.MILLI, - 1)
        }
        return Ext.util.Format.date(b, this.format)
    },
    afterRender: function () {
        this.callParent(arguments);
        var a = this.ownerCt.up("treepanel");
        a.on({
            edit: this.onTreeEdit,
            beforeedit: this.onBeforeTreeEdit,
            scope: this
        })
    },
    onBeforeTreeEdit: function (b) {
        if (b.column == this) {
            b.doNotUpdateRecord = true;
            var a = this.task = b.record;
            if (!a.isEditable(this.dataIndex)) {
                return false
            }
            if (a.getEndDate() > a.getStartDate()) {
                var c = b.value;
                if (c - Ext.Date.clearTime(c, true) === 0 && !Ext.Date.formatContainsHourInfo(this.editorFormat)) {
                    c = Sch.util.Date.add(c, Sch.util.Date.MILLI, - 1)
                }
                b.value = Ext.Date.parse(Ext.Date.format(c, this.editorFormat), this.editorFormat)
            }
        }
    },
    onBeforeEditComplete: function (b, c, a) {
        if (this.task && c < this.task.getStartDate()) {
            return false
        }
    },
    onTreeEdit: function (c, b) {
        if (b.column === this && b.value) {
            var a = b.record;
            var d = b.value;
            if (!Ext.Date.formatContainsHourInfo(this.editorFormat)) {
                d = a.getCalendar().getCalendarDay(d).getAvailabilityEndFor(d) || d
            }
            b.record.setEndDate(d, false)
        }
    }
});
Ext.define("Gnt.column.PercentDone", {
    extend: "Ext.grid.column.Number",
    alias: "widget.percentdonecolumn",
    text: "% Done",
    width: 50,
    format: "0",
    align: "center",
    field: {
        xtype: "numberfield",
        minValue: 0,
        maxValue: 100
    },
    beforeRender: function () {
        if (!this.dataIndex) {
            var a = this.up("treepanel");
            this.dataIndex = a.store.model.prototype.percentDoneField
        }
        this.callParent(arguments)
    }
});
Ext.define("Gnt.column.StartDate", {
    extend: "Ext.grid.column.Date",
    alias: "widget.startdatecolumn",
    text: "Start",
    width: 100,
    align: "left",
    editorFormat: null,
    constructor: function (a) {
        a = a || {};
        var b = a.field || a.editor;
        delete a.field;
        delete a.editor;
        this.field = Ext.create("Ext.grid.CellEditor", {
            ignoreNoChange: true,
            field: b || {
                xtype: "datefield",
                format: a.editorFormat || a.format || this.format || Ext.Date.defaultFormat
            }
        });
        this.callParent([a]);
        this.editorFormat = this.editorFormat || this.format
    },
    beforeRender: function () {
        var a = this.up("treepanel");
        if (!this.dataIndex) {
            this.dataIndex = a.store.model.prototype.startDateField
        }
        this.callParent(arguments);
        a.on({
            edit: this.onTreeEdit,
            beforeedit: this.onBeforeTreeEdit,
            scope: this
        })
    },
    onBeforeTreeEdit: function (c) {
        if (c.column == this) {
            c.doNotUpdateRecord = true;
            var b = c.record;
            if (!b.isEditable(this.dataIndex)) {
                return false
            }
            var a = c.value;
            if (a) {
                c.value = Ext.Date.parse(Ext.Date.format(a, this.editorFormat), this.editorFormat)
            }
        }
    },
    onTreeEdit: function (c, b) {
        var a = b.record;
        var d = b.value;
        if (b.column == this && d && d - b.originalValue !== 0) {
            a.setStartDate(d, true, a.getTaskStore().skipWeekendsDuringDragDrop)
        }
    }
});
Ext.define("Gnt.column.WBS", {
    extend: "Ext.grid.column.Column",
    alias: "widget.wbscolumn",
    text: "#",
    width: 40,
    align: "left",
    dataIndex: "index",
    renderer: function (f, g, b, h, d, e) {
        var a = e.getRootNode(),
            c = [];
        while (b !== a) {
            c.push(b.data.index + 1);
            b = b.parentNode
        }
        return c.reverse().join(".")
    }
});
Ext.define("Gnt.column.SchedulingMode", {
    extend: "Ext.grid.column.Column",
    alias: "widget.schedulingmodecolumn",
    text: "Mode",
    width: 100,
    align: "left",
    data: [
        ["FixedDuration", "Fixed duration"],
        ["EffortDriven", "Effort driven"],
        ["DynamicAssignment", "Dynamic assignment"],
        ["Manual", "Manual"],
        ["Normal", "Normal"]
    ],
    modeNames: null,
    pickerAlign: "tl-bl?",
    matchFieldWidth: true,
    constructor: function (a) {
        a = a || {};
        var c = a.field || a.editor;
        a.field = c || {
            xtype: "combo",
            editable: false,
            store: this.data,
            pickerAlign: this.pickerAlign,
            matchFieldWidth: this.matchFieldWidth
        };
        var b = this.modeNames = {};
        Ext.Array.each(this.data, function (d) {
            b[d[0]] = d[1]
        });
        this.scope = this;
        this.callParent([a])
    },
    beforeRender: function () {
        if (!this.dataIndex) {
            var a = this.up("treepanel");
            this.dataIndex = a.store.model.prototype.schedulingModeField
        }
        this.callParent(arguments)
    },
    renderer: function (a) {
        return this.modeNames[a]
    },
    afterRender: function () {
        this.callParent(arguments);
        this.tree = this.ownerCt.up("treepanel");
        this.tree.on("edit", this.onTreeEdit, this)
    },
    onTreeEdit: function (b, a) {
        if (a.column == this) {
            a.record.setSchedulingMode(a.value)
        }
    }
});
Ext.define("Gnt.column.ResourceAssignment", {
    extend: "Ext.grid.column.Column",
    alias: "widget.resourceassignmentcolumn",
    text: "Assigned Resources",
    tdCls: "sch-assignment-cell",
    showUnits: true,
    assignmentStore: null,
    initComponent: function () {
        this.formatString = "{0}" + (this.showUnits ? " [{1}%]" : "");
        this.callParent(arguments)
    },
    afterRender: function () {
        this.scope = this;
        this.callParent(arguments);
        this.assignmentStore = this.getOwnerHeaderCt().up("ganttpanel").assignmentStore
    },
    renderer: function (k, o, b, h, n, m, j) {
        var g = [],
            e = this.assignmentStore,
            a, f = b.getInternalId();
        if (e.resourceStore.getCount() > 0) {
            for (var d = 0, c = e.getCount(); d < c; d++) {
                a = e.getAt(d);
                if (a.getTaskId() === f) {
                    g.push(Ext.String.format(this.formatString, a.getResourceName(), a.getUnits()))
                }
            }
            return g.join(", ")
        }
    }
});
Ext.define("Gnt.column.ResourceName", {
    extend: "Ext.grid.column.Column",
    alias: "widget.resourcenamecolumn",
    text: "Resource Name",
    dataIndex: "ResourceName",
    flex: 1,
    align: "left"
});
Ext.define("Gnt.column.AssignmentUnits", {
    extend: "Ext.grid.column.Number",
    alias: "widget.assignmentunitscolumn",
    text: "Units",
    dataIndex: "Units",
    format: "0 %",
    align: "left"
});
Ext.define("Gnt.widget.AssignmentGrid", {
    requires: ["Gnt.model.Resource", "Gnt.model.Assignment", "Gnt.column.ResourceName", "Gnt.column.AssignmentUnits", "Ext.grid.plugin.CellEditing"],
    extend: "Ext.grid.Panel",
    alias: "widget.assignmentgrid",
    readOnly: false,
    cls: "gnt-assignmentgrid",
    defaultAssignedUnits: 100,
    sorter: {
        sorterFn: function (b, a) {
            var d = b.getUnits(),
                c = a.getUnits();
            if ((!d && !c) || (d && c)) {
                return b.get("ResourceName") < a.get("ResourceName") ? -1 : 1
            }
            return d ? -1 : 1
        }
    },
    constructor: function (a) {
        this.store = Ext.create("Ext.data.JsonStore", {
            model: Ext.define("Gnt.model.AssignmentEditing", {
                extend: "Gnt.model.Assignment",
                fields: ["ResourceName"]
            })
        });
        this.columns = this.buildColumns();
        if (!this.readOnly) {
            this.plugins = this.buildPlugins()
        }
        Ext.apply(this, {
            selModel: {
                selType: "checkboxmodel",
                mode: "MULTI",
                checkOnly: true,
                selectByPosition: function (b) {
                    var c = this.store.getAt(b.row);
                    this.select(c, true)
                }
            }
        });
        this.callParent(arguments)
    },
    initComponent: function () {
        this.loadResources();
        this.resourceStore.on({
            datachanged: this.loadResources,
            scope: this
        });
        this.getSelectionModel().on("select", this.onSelect, this, {
            delay: 50
        });
        this.callParent(arguments)
    },
    onSelect: function (b, a) {
        if ((!this.cellEditing || !this.cellEditing.getActiveEditor()) && !a.getUnits()) {
            a.setUnits(this.defaultAssignedUnits)
        }
    },
    loadResources: function () {
        var d = [],
            b = this.resourceStore,
            e;
        for (var c = 0, a = b.getCount(); c < a; c++) {
            e = b.getAt(c).getId();
            d.push({
                ResourceId: e,
                ResourceName: b.getById(e).getName()
            })
        }
        this.store.loadData(d)
    },
    buildPlugins: function () {
        var a = this.cellEditing = Ext.create("Ext.grid.plugin.CellEditing", {
            clicksToEdit: 1
        });
        a.on("edit", this.onEditingDone, this);
        return [a]
    },
    onEditingDone: function (a, b) {
        if (b.value) {
            this.getSelectionModel().select(b.record, true)
        } else {
            this.getSelectionModel().deselect(b.record);
            b.record.reject()
        }
    },
    buildColumns: function () {
        return [{
            xtype: "resourcenamecolumn",
            resourceStore: this.resourceStore
        }, {
            xtype: "assignmentunitscolumn",
            assignmentStore: this.assignmentStore,
            editor: {
                xtype: "numberfield",
                minValue: 0,
                step: 10
            }
        }]
    },
    loadTaskAssignments: function (d) {
        var b = this.store,
            f = this.getSelectionModel();
        f.deselectAll(true);
        for (var c = 0, a = b.getCount(); c < a; c++) {
            b.getAt(c).data.Units = "";
            b.getAt(c).data.Id = null
        }
        b.suspendEvents();
        var e = this.assignmentStore.queryBy(function (g) {
            return g.getTaskId() === d
        });
        e.each(function (h) {
            var g = b.findRecord("ResourceId", h.getResourceId(), 0, false, true, true);
            if (g) {
                g.setUnits(h.getUnits());
                g.set(g.idProperty, h.getId());
                f.select(g, true, true)
            }
        });
        b.resumeEvents();
        b.sort(this.sorter);
        this.getView().refresh()
    }
});
Ext.define("Gnt.widget.AssignmentField", {
    extend: "Ext.form.field.Picker",
    alias: "widget.assignmenteditor",
    requires: ["Gnt.widget.AssignmentGrid"],
    matchFieldWidth: false,
    editable: false,
    cancelText: "Cancel",
    closeText: "Save and Close",
    assignmentStore: null,
    resourceStore: null,
    gridConfig: null,
    createPicker: function () {
        var a = new Gnt.widget.AssignmentGrid(Ext.apply({
            ownerCt: this.ownerCt,
            renderTo: document.body,
            frame: true,
            floating: true,
            hidden: true,
            height: 200,
            width: 300,
            resourceStore: this.resourceStore,
            assignmentStore: this.assignmentStore,
            fbar: this.buildButtons()
        }, this.gridConfig || {}));
        return a
    },
    buildButtons: function () {
        return ["->", {
            text: this.closeText,
            handler: function () {
                Ext.Function.defer(this.onGridClose, Ext.isIE && !Ext.isIE9 ? 60 : 30, this)
            },
            scope: this
        }, {
            text: this.cancelText,
            handler: this.collapse,
            scope: this
        }]
    },
    onExpand: function () {
        var a = this.resourceStore,
            b = this.picker;
        b.loadTaskAssignments(this.taskId)
    },
    onGridClose: function () {
        var b = this.picker.getSelectionModel(),
            a = b.selected;
        this.fireEvent("select", this, a);
        this.collapse()
    },
    collapseIf: function (b) {
        var a = this;
        if (this.picker && !b.getTarget(".x-editor") && !b.getTarget(".x-menu-item")) {
            a.callParent(arguments)
        }
    }
});
Ext.define("Gnt.widget.AssignmentCellEditor", {
    extend: "Ext.grid.CellEditor",
    requires: ["Gnt.model.Assignment", "Gnt.widget.AssignmentField"],
    assignmentStore: null,
    resourceStore: null,
    taskId: null,
    fieldConfig: null,
    allowBlur: false,
    constructor: function (a) {
        a = a || {};
        var b = a.fieldConfig || {};
        this.field = Ext.create("Gnt.widget.AssignmentField", Ext.apply(b, {
            assignmentStore: a.assignmentStore,
            resourceStore: a.resourceStore
        }));
        this.field.on({
            select: this.onSelect,
            collapse: this.cancelEdit,
            scope: this
        });
        this.callParent(arguments)
    },
    startEdit: function (c, d, b) {
        this.parentEl = null;
        var a = c.child("div").dom.innerHTML;
        this.taskId = this.field.taskId = b.record.getInternalId();
        this.callParent([c, a === "&nbsp;" ? "" : a]);
        this.field.expand()
    },
    onSelect: function (g, c) {
        var a = this.assignmentStore,
            f = this.taskId;
        var e = {};
        var d = [];
        c.each(function (i) {
            var h = i.getUnits();
            if (h > 0) {
                var k = i.getId();
                if (k) {
                    e[k] = true;
                    a.getById(k).setUnits(h)
                } else {
                    var j = Ext.create(a.model);
                    j.setTaskId(f);
                    j.setResourceId(i.getResourceId());
                    j.setUnits(h);
                    e[j.internalId] = true;
                    d.push(j)
                }
            }
        });
        var b = [];
        a.each(function (h) {
            if (h.getTaskId() === f && !e[h.getId() || h.internalId]) {
                b.push(h)
            }
        });
        a.remove(b);
        a.add(d);
        this.completeEdit()
    }
});
Ext.define("Gnt.widget.DurationField", {
    extend: "Ext.form.field.Number",
    alias: "widget.durationfield",
    alternateClassName: "Gnt.column.duration.Field",
    disableKeyFilter: true,
    minValue: 0,
    durationRegex: /(-?\d+(?:[.,]\d+)?)\s*(\w+)?/i,
    unitsRegex: {
        MILLI: /^ms$|^mil/i,
        SECOND: /^s$|^sec/i,
        MINUTE: /^m$|^min/i,
        HOUR: /^h$|^hr$|^hour/i,
        DAY: /^d$|^day/i,
        WEEK: /^w$|^wk|^week/i,
        MONTH: /^mo|^mnt/i,
        QUARTER: /^q$|^quar|^qrt/i,
        YEAR: /^y$|^yr|^year/i
    },
    durationUnit: "h",
    useAbbreviation: false,
    rawToValue: function (b) {
        var a = this.parseDuration(b);
        if (!a) {
            return null
        }
        this.durationUnit = a.unit;
        return a.value != null ? a.value : null
    },
    valueToRaw: function (a) {
        if (Ext.isNumber(a)) {
            return parseFloat(Ext.Number.toFixed(a, this.decimalPrecision)) + " " + Sch.util.Date[this.useAbbreviation ? "getShortNameOfUnit" : "getReadableNameOfUnit"](this.durationUnit, a > 1)
        }
        return ""
    },
    parseDuration: function (c) {
        if (c == null || !this.durationRegex.test(c)) {
            return null
        }
        var a = this.durationRegex.exec(c);
        var e = this.parseValue(a[1]);
        var b = a[2];
        var d;
        if (b) {
            Ext.iterate(this.unitsRegex, function (f, g) {
                if (g.test(b)) {
                    d = Sch.util.Date.getUnitByName(f);
                    return false
                }
            })
        }
        return {
            value: e,
            unit: d || this.durationUnit
        }
    },
    getDurationValue: function () {
        return this.parseDuration(this.getRawValue())
    },
    getErrors: function (b) {
        var a = this.parseDuration(b);
        if (!a) {
            return ["Invalid number format"]
        }
        return this.callParent([a.value])
    }
});
Ext.define("Gnt.widget.DurationEditor", {
    extend: "Ext.grid.CellEditor",
    alias: ["widget.durationeditor", "widget.durationcolumneditor"],
    alternateClassName: "Gnt.column.duration.Editor",
    context: null,
    decimalPrecision: 2,
    getDurationUnitMethod: "getDurationUnit",
    setDurationMethod: "setDuration",
    useAbbreviation: false,
    constructor: function (a) {
        a = a || {};
        Ext.apply(this, a);
        a.field = a.field || Ext.create("Gnt.widget.DurationField", {
            useAbbreviation: this.useAbbreviation,
            decimalPrecision: this.decimalPrecision
        });
        this.callParent([a])
    },
    startEdit: function (c, b, a) {
        this.context = a;
        this.field.durationUnit = a.record[this.getDurationUnitMethod]();
        return this.callParent(arguments)
    },
    completeEdit: function (a) {
        var d = this,
            g = d.field,
            e;
        if (!d.editing) {
            return
        }
        if (g.assertValue) {
            g.assertValue()
        }
        e = d.getValue();
        if (!g.isValid()) {
            if (d.revertInvalid !== false) {
                d.cancelEdit(a)
            }
            return
        }
        if (String(e) === String(d.startValue) && d.ignoreNoChange) {
            d.hideEdit(a);
            return
        }
        if (d.fireEvent("beforecomplete", d, e, d.startValue) !== false) {
            e = d.getValue();
            if (d.updateEl && d.boundEl) {
                d.boundEl.update(e)
            }
            d.hideEdit(a);
            var c = this.context;
            var b = c.record;
            var f = this.field.getDurationValue();
            b[this.setDurationMethod](f.value, f.unit);
            d.fireEvent("complete", d, e, d.startValue)
        }
    }
});
Ext.define("Gnt.column.Duration", {
    extend: "Ext.grid.column.Column",
    alias: "widget.durationcolumn",
    requires: ["Gnt.widget.DurationField", "Gnt.widget.DurationEditor"],
    text: "Duration",
    width: 80,
    align: "left",
    decimalPrecision: 2,
    getDurationUnitMethod: "getDurationUnit",
    setDurationMethod: "setDuration",
    useAbbreviation: false,
    constructor: function (a) {
        a = a || {};
        Ext.apply(this, a);
        a.editor = a.editor || Ext.create("Gnt.widget.DurationEditor", {
            useAbbreviation: this.useAbbreviation,
            decimalPrecision: this.decimalPrecision,
            getDurationUnitMethod: this.getDurationUnitMethod,
            setDurationMethod: this.setDurationMethod
        });
        if (!a.editor.isFormField) {
            a.editor = Ext.ComponentManager.create(a.editor, "durationcolumneditor")
        }
        this.scope = this;
        this.callParent([a]);
        this.mon(this.editor, "beforestartedit", this.onBeforeStartEdit, this)
    },
    beforeRender: function () {
        if (!this.dataIndex) {
            var a = this.up("treepanel");
            this.dataIndex = a.store.model.prototype.durationField
        }
        this.callParent(arguments)
    },
    onBeforeStartEdit: function (b) {
        var a = b.context.record;
        return a.isEditable(this.dataIndex)
    },
    renderer: function (b, c, a) {
        if (!Ext.isNumber(b)) {
            return ""
        }
        if (!a.isEditable(this.dataIndex)) {
            c.tdCls = (c.tdCls || "") + " sch-column-readonly"
        }
        b = parseFloat(Ext.Number.toFixed(b, this.decimalPrecision));
        return b + " " + Sch.util.Date[this.useAbbreviation ? "getShortNameOfUnit" : "getReadableNameOfUnit"](a[this.getDurationUnitMethod](), b > 1)
    }
});
Ext.define("Gnt.column.Effort", {
    extend: "Gnt.column.Duration",
    alias: "widget.effortcolumn",
    header: "Effort",
    getDurationUnitMethod: "getEffortUnit",
    setDurationMethod: "setEffort",
    beforeRender: function () {
        if (!this.dataIndex) {
            var a = this.up("treepanel");
            this.dataIndex = a.store.model.prototype.effortField
        }
        this.callParent(arguments)
    }
});
Ext.define("Gnt.widget.Calendar", {
    extend: "Ext.picker.Date",
    alias: "widget.ganttcalendar",
    requires: ["Gnt.data.Calendar", "Sch.util.Date"],
    calendar: null,
    startDate: null,
    endDate: null,
    disabledDatesText: "Holiday",
    initComponent: function () {
        if (!this.calendar) {
            Ext.Error.raise('Required attribute "calendar" missing during initialization of `Gnt.widget.Calendar`')
        }
        if (!this.startDate) {
            Ext.Error.raise('Required attribute "startDate" missing during initialization of `Gnt.widget.Calendar`')
        }
        if (!this.endDate) {
            this.endDate = Sch.util.Date.add(this.startDate, Sch.util.Date.MONTH, 1)
        }
        this.setCalendar(this.calendar);
        this.minDate = this.value = this.startDate;
        this.injectDates();
        this.callParent(arguments)
    },
    injectDates: function () {
        var a = this;
        var b = a.disabledDates = [];
        Ext.each(a.calendar.getHolidaysRanges(a.startDate, a.endDate), function (c) {
            c.forEachDate(function (d) {
                b.push(Ext.Date.format(d, a.format))
            })
        });
        a.setDisabledDates(b)
    },
    setCalendar: function (b) {
        var a = {
            update: this.injectDates,
            remove: this.injectDates,
            add: this.injectDates,
            load: this.injectDates,
            clear: this.injectDates,
            scope: this
        };
        if (this.calendar) {
            this.calendar.un(a)
        }
        this.calendar = b;
        b.on(a)
    }
});
Ext.define("Gnt.widget.calendar.DayGrid", {
    extend: "Ext.grid.Panel",
    title: "Day overrides",
    height: 180,
    nameText: "Name",
    dateText: "Date",
    noNameText: "[Day override]",
    initComponent: function () {
        Ext.applyIf(this, {
            store: Ext.create("Gnt.data.Calendar", {
                proxy: "memory"
            }),
            plugins: [Ext.create("Ext.grid.plugin.CellEditing", {
                clicksToEdit: 2
            })],
            columns: [{
                header: this.nameText,
                dataIndex: "Name",
                flex: 1,
                editor: {
                    allowBlank: false
                }
            }, {
                header: this.dateText,
                dataIndex: "Date",
                width: 100,
                xtype: "datecolumn",
                editor: {
                    xtype: "datefield"
                }
            }]
        });
        this.callParent(arguments)
    }
});
Ext.define("Gnt.widget.calendar.WeekGrid", {
    extend: "Ext.grid.Panel",
    requires: ["Gnt.model.WeekAvailability"],
    title: "Week overrides",
    border: true,
    height: 220,
    nameText: "Name",
    startDateText: "Start date",
    endDateText: "End date",
    initComponent: function () {
        Ext.applyIf(this, {
            store: Ext.create("Ext.data.Store", {
                model: "Gnt.model.WeekAvailability",
                proxy: "memory"
            })
        });
        Ext.applyIf(this, {
            columns: [{
                header: this.nameText,
                dataIndex: this.store.model.prototype.nameField,
                flex: 1,
                editor: {
                    allowBlank: false
                }
            }, {
                header: this.startDateText,
                dataIndex: this.store.model.prototype.startDateField,
                width: 100,
                xtype: "datecolumn",
                editor: {
                    xtype: "datefield"
                }
            }, {
                header: this.endDateText,
                dataIndex: this.store.model.prototype.endDateField,
                width: 100,
                xtype: "datecolumn",
                editor: {
                    xtype: "datefield"
                }
            }],
            plugins: [Ext.create("Ext.grid.plugin.CellEditing", {
                clicksToEdit: 2
            })]
        });
        this.callParent(arguments)
    }
});
Ext.define("Gnt.widget.calendar.ResourceCalendarGrid", {
    extend: "Ext.grid.Panel",
    requires: ["Gnt.data.Calendar", "Sch.util.Date"],
    alias: "widget.resourcecalendargrid",
    resourceStore: null,
    calendarStore: null,
    initComponent: function () {
        var a = this;
        this.calendarStore = this.calendarStore || Ext.create("Ext.data.Store", {
            fields: ["Id", "Name"]
        });
        Ext.apply(a, {
            store: a.resourceStore,
            columns: [{
                header: "Name",
                dataIndex: "Name",
                flex: 1
            }, {
                header: "Calendar",
                dataIndex: "CalendarId",
                flex: 1,
                renderer: function (f, h, b, e, d, c) {
                    if (!f) {
                        var g = b.getCalendar();
                        f = g ? g.calendarId : ""
                    }
                    var i = a.calendarStore.getById(f);
                    return i ? i.get("Name") : f
                },
                editor: {
                    xtype: "combobox",
                    store: a.calendarStore,
                    queryMode: "local",
                    displayField: "Name",
                    valueField: "Id",
                    editable: false,
                    allowBlank: false
                }
            }],
            border: true,
            height: 180,
            plugins: [Ext.create("Ext.grid.plugin.CellEditing", {
                clicksToEdit: 2
            })]
        });
        this.calendarStore.loadData(this.getCalendarData());
        this.callParent(arguments)
    },
    getCalendarData: function () {
        var a = [];
        Ext.Array.each(Gnt.data.Calendar.getAllCalendars(), function (b) {
            a.push({
                Id: b.calendarId,
                Name: b.name || b.calendarId
            })
        });
        return a
    }
});
Ext.define("Gnt.widget.calendar.DayAvailabilityGrid", {
    extend: "Ext.grid.Panel",
    requires: ["Gnt.data.Calendar", "Sch.util.Date"],
    alias: "widget.dayavailabilitygrid",
    height: 160,
    calendarDay: null,
    startText: "Start",
    endText: "End",
    addText: "Add",
    removeText: "Remove",
    workingTimeText: "Working time",
    nonworkingTimeText: "Non-working time",
    getDayTypeRadioGroup: function () {
        return this.down('radiogroup[name="dayType"]')
    },
    initComponent: function () {
        Ext.applyIf(this, {
            store: Ext.create("Ext.data.Store", {
                fields: ["startTime", "endTime"],
                proxy: {
                    type: "memory",
                    reader: {
                        type: "json"
                    }
                }
            }),
            plugins: [Ext.create("Ext.grid.plugin.CellEditing", {
                clicksToEdit: 2
            })],
            dockedItems: [{
                xtype: "radiogroup",
                dock: "top",
                name: "dayType",
                padding: "0 5px",
                margin: 0,
                items: [{
                    boxLabel: this.workingTimeText,
                    name: "IsWorkingDay",
                    inputValue: true
                }, {
                    boxLabel: this.nonworkingTimeText,
                    name: "IsWorkingDay",
                    inputValue: false
                }],
                listeners: {
                    change: this.onDayTypeChanged,
                    scope: this
                }
            }],
            tbar: this.buildToolbar(),
            columns: [{
                header: this.startText,
                xtype: "datecolumn",
                format: "g:i a",
                dataIndex: "startTime",
                flex: 1,
                editor: {
                    xtype: "timefield",
                    allowBlank: false,
                    initDate: "31/12/1899"
                }
            }, {
                header: this.endText,
                xtype: "datecolumn",
                format: "g:i a",
                dataIndex: "endTime",
                flex: 1,
                editor: {
                    allowBlank: false,
                    xtype: "timefield",
                    initDate: "31/12/1899"
                }
            }],
            listeners: {
                selectionchange: this.onAvailabilityGridSelectionChange,
                scope: this
            }
        });
        this.callParent(arguments)
    },
    buildToolbar: function () {
        this.addButton = new Ext.Button({
            text: this.addText,
            iconCls: "gnt-action-add",
            handler: this.addAvailability,
            scope: this
        });
        this.removeButton = new Ext.Button({
            text: this.removeText,
            iconCls: "gnt-action-remove",
            handler: this.removeAvailability,
            scope: this,
            disabled: true
        });
        return [this.addButton, this.removeButton]
    },
    onAvailabilityGridSelectionChange: function (a) {
        if (this.removeButton) {
            this.removeButton.setDisabled(!a || a.getSelection().length === 0)
        }
    },
    onDayTypeChanged: function (a) {
        var b = a.getValue();
        if (Ext.isArray(b.IsWorkingDay)) {
            return
        }
        this.getView().setDisabled(!b.IsWorkingDay)
    },
    addAvailability: function () {
        var a = this.getStore(),
            b = a.count();
        if (b >= 5) {
            return
        }
        a.add({
            startTime: new Date(0, 0, 0, 12, 0),
            endTime: new Date(0, 0, 0, 13, 0)
        });
        if (b + 1 >= 5 && this.addButton) {
            this.addButton.setDisabled(true)
        }
    },
    removeAvailability: function () {
        var b = this.getStore(),
            c = b.count(),
            d = this.getSelectionModel();
        if (!d || d.getSelection().length === 0) {
            return
        }
        var a = d.getSelection()[0];
        b.remove(a);
        if (c < 5 && this.addButton) {
            this.addButton.setDisabled(false)
        }
    },
    editAvailability: function (a) {
        this.calendarDay = a;
        this.getDayTypeRadioGroup().setValue({
            IsWorkingDay: a.getIsWorkingDay()
        });
        var b = this.calendarDay.getAvailability();
        this.getStore().loadData(b)
    },
    isWorkingDay: function () {
        return this.getDayTypeRadioGroup().getValue().IsWorkingDay
    },
    isValid: function () {
        var c = this.getDayTypeRadioGroup().getValue().IsWorkingDay,
            b = [];
        if (c) {
            try {
                b = this.getIntervals();
                this.calendarDay.verifyAvailability(b)
            } catch (a) {
                Ext.MessageBox.alert("Error", a);
                return false
            }
        }
        return true
    },
    getIntervals: function () {
        var a = [];
        this.getStore().each(function (b) {
            a.push({
                startTime: b.get("startTime"),
                endTime: b.get("endTime")
            })
        });
        return a
    }
});
Ext.define("Gnt.widget.calendar.WeekEditor", {
    extend: "Ext.form.Panel",
    requires: ["Ext.grid.*", "Gnt.data.Calendar", "Sch.util.Date"],
    alias: "widget.calendarweekeditor",
    layout: "anchor",
    defaults: {
        border: false,
        anchor: "100%"
    },
    getDefaultWeekAvailabilityHandler: null,
    startDate: null,
    endDate: null,
    startHeaderText: "Start",
    endHeaderText: "End",
    defaultTimeText: "Default time",
    workingTimeText: "Working time",
    nonworkingTimeText: "Non-working time",
    addText: "Add",
    removeText: "Remove",
    weekAvailability: null,
    currentWeekDay: null,
    _weekDaysGrid: null,
    getWeekDaysGrid: function () {
        if (this._weekDaysGrid != null) {
            return this._weekDaysGrid
        }
        var a = Ext.Date.dayNames;
        return this._weekDaysGrid = Ext.create("Ext.grid.Panel", {
            hideHeaders: true,
            height: 160,
            columns: [{
                header: "",
                dataIndex: "name",
                flex: 1
            }],
            store: Ext.create("Ext.data.JsonStore", {
                fields: ["id", "name"],
                idProperty: "id",
                data: [{
                    id: 1,
                    name: a[1]
                }, {
                    id: 2,
                    name: a[2]
                }, {
                    id: 3,
                    name: a[3]
                }, {
                    id: 4,
                    name: a[4]
                }, {
                    id: 5,
                    name: a[5]
                }, {
                    id: 6,
                    name: a[6]
                }, {
                    id: 0,
                    name: a[0]
                }]
            }),
            listeners: {
                selectionchange: {
                    fn: this.onWeekDaysListSelectionChange,
                    scope: this
                }
            }
        })
    },
    _availabilityGrid: null,
    getAvailabilityGrid: function () {
        if (!this._availabilityGrid) {
            this._availabilityGrid = Ext.create("Ext.grid.Panel", {
                height: 160,
                plugins: [Ext.create("Ext.grid.plugin.CellEditing", {
                    clicksToEdit: 2
                })],
                tbar: [{
                    text: this.addText,
                    action: "add",
                    handler: this.addAvailability,
                    scope: this,
                    iconCls: "gnt-action-add"
                }, {
                    text: this.removeText,
                    iconCls: "gnt-action-remove",
                    action: "remove",
                    handler: this.removeAvailability,
                    scope: this
                }],
                store: Ext.create("Ext.data.Store", {
                    fields: ["startTime", "endTime"],
                    proxy: {
                        type: "memory",
                        reader: {
                            type: "json"
                        }
                    }
                }),
                columns: [{
                    header: this.startHeaderText,
                    xtype: "datecolumn",
                    format: "g:i a",
                    dataIndex: "startTime",
                    flex: 1,
                    editor: {
                        xtype: "timefield",
                        allowBlank: false,
                        initDate: "31/12/1899"
                    }
                }, {
                    header: this.endHeaderText,
                    xtype: "datecolumn",
                    format: "g:i a",
                    dataIndex: "endTime",
                    flex: 1,
                    editor: {
                        allowBlank: false,
                        xtype: "timefield",
                        initDate: "31/12/1899"
                    }
                }],
                listeners: {
                    selectionchange: this.onAvailabilityGridSelectionChange,
                    scope: this
                }
            })
        }
        return this._availabilityGrid
    },
    getDayTypeRadioGroup: function () {
        return this.down('radiogroup[name="dayType"]')
    },
    initComponent: function () {
        if (!this.getDefaultWeekAvailabilityHandler && !Ext.isFunction(this.getDefaultWeekAvailabilityHandler)) {
            Ext.Error.raise('Required attribute "getDefaultWeekAvailabilityHandler" is missed during initialization of `Gnt.widget.calendar.WeekEditor`')
        }
        this.items = [{
            xtype: "radiogroup",
            padding: "0 5px",
            name: "dayType",
            items: [{
                boxLabel: this.defaultTimeText,
                name: "IsWorkingDay",
                inputValue: 0
            }, {
                boxLabel: this.workingTimeText,
                name: "IsWorkingDay",
                inputValue: 1
            }, {
                boxLabel: this.nonworkingTimeText,
                name: "IsWorkingDay",
                inputValue: 2
            }],
            listeners: {
                change: {
                    fn: this.onDayTypeChanged,
                    scope: this
                }
            }
        }, {
            layout: "column",
            padding: "0 0 5px 0",
            defaults: {
                border: false
            },
            items: [{
                margin: "0 10px 0 5px",
                columnWidth: 0.5,
                items: this.getWeekDaysGrid()
            }, {
                columnWidth: 0.5,
                margin: "0 5px 0 0",
                items: this.getAvailabilityGrid()
            }]
        }];
        this.callParent(arguments)
    },
    addAvailability: function () {
        var b = this.getAvailabilityGrid(),
            a = b.getStore(),
            c = a.count();
        if (c >= 5) {
            return
        }
        a.add({
            startTime: new Date(0, 0, 0, 12, 0),
            endTime: new Date(0, 0, 0, 13, 0)
        });
        if (c + 1 >= 5) {
            b.down('button[action="add"]').setDisabled(true)
        }
    },
    removeAvailability: function () {
        var c = this.getAvailabilityGrid(),
            b = c.getStore(),
            d = b.count(),
            e = c.getSelectionModel();
        if (!e || e.getSelection().length === 0) {
            return
        }
        var a = e.getSelection()[0];
        b.remove(a);
        if (d < 5) {
            c.down('button[action="add"]').setDisabled(false)
        }
    },
    editAvailability: function (b, e, a) {
        this.startDate = b;
        this.endDate = e;
        this.weekAvailability = a;
        var c = this.getWeekDaysGrid(),
            d = c.getStore().getAt(0);
        c.getSelectionModel().select(d, false, true);
        this.refreshView(d)
    },
    applyChanges: function (a) {
        if (!this.validateAndSave()) {
            return false
        }
        if (a && Ext.isFunction(a)) {
            a.call(this, this.weekAvailability)
        }
    },
    getIntervals: function () {
        var a = [];
        this.getAvailabilityGrid().getStore().each(function (b) {
            a.push({
                startTime: b.get("startTime"),
                endTime: b.get("endTime")
            })
        });
        return a
    },
    onWeekDaysListSelectionChange: function (a, b) {
        if (!this.validateAndSave()) {
            return false
        }
        this.refreshView(b[0])
    },
    validateAndSave: function () {
        var c = this.currentWeekDay.get("IsWorkingDay"),
            b = [];
        if (c) {
            try {
                b = this.getIntervals();
                this.currentWeekDay.verifyAvailability(b)
            } catch (a) {
                Ext.MessageBox.alert("Error", a);
                return false
            }
        }
        this.currentWeekDay.setAvailability(b);
        return true
    },
    refreshView: function (d) {
        var g = d.getId(),
            b = this.weekAvailability[g],
            f = this.getDayTypeRadioGroup(),
            e = b.getAvailability(),
            c = /^(\d)-(\d\d\d\d\/\d\d\/\d\d)-(\d\d\d\d\/\d\d\/\d\d)$/.exec(b.getId()),
            a = !c ? 0 : (b.get("IsWorkingDay") ? 1 : 2);
        this.currentWeekDay = b;
        f.setValue({
            IsWorkingDay: [a]
        });
        this.getAvailabilityGrid().getStore().loadData(e)
    },
    onAvailabilityGridSelectionChange: function (b) {
        var a = this.getAvailabilityGrid();
        a.down('button[action="remove"]').setDisabled(!b || b.getSelection().length === 0)
    },
    onDayTypeChanged: function (g) {
        var c = g.getValue();
        if (Ext.isArray(c.IsWorkingDay)) {
            return
        }
        var a = this.getWeekDaysGrid(),
            d = a.getSelectionModel(),
            b = d.getSelection()[0].getId(),
            e = this.weekAvailability[b].get("Name"),
            f = [],
            i = Ext.Date.format(this.startDate, "Y/m/d"),
            j = Ext.Date.format(this.endDate, "Y/m/d");
        switch (c.IsWorkingDay) {
        case 0:
            var h = this.getDefaultWeekAvailabilityHandler()[b];
            h.set("Name", e);
            h.set("Date", null);
            f = h.getAvailability();
            this.weekAvailability[b] = h;
            break;
        default:
            f = this.weekAvailability[b].getAvailability();
            this.currentWeekDay.set("Id", Ext.String.format("{0}-{1}-{2}", b, i, j));
            this.currentWeekDay.set("IsWorkingDay", c.IsWorkingDay === 1);
            break
        }
        this.getAvailabilityGrid().getStore().loadData(Ext.clone(f));
        this.getAvailabilityGrid().setDisabled(c.IsWorkingDay !== 1)
    }
});
Ext.define("Gnt.widget.calendar.DatePicker", {
    extend: "Ext.picker.Date",
    alias: "widget.gntdatepicker",
    calendar: null,
    workingDayCls: "gnt-datepicker-workingday",
    nonWorkingDayCls: "gnt-datepicker-nonworkingday",
    overriddenDayCls: "gnt-datepicker-overriddenday",
    overriddenWeekDayCls: "gnt-datepicker-overriddenweekday",
    _weeks: null,
    getWeekOverrides: function () {
        return this._weeks
    },
    setWeekOverrides: function (a) {
        this._weeks = a
    },
    _days: null,
    getDayOverrides: function () {
        return this._days
    },
    setDayOverrides: function (a) {
        this._days = a
    },
    update: function (b, e) {
        var d = this,
            c = 0,
            a = d.cells.elements;
        this.removeCustomCls();
        this.callParent(arguments);
        for (; c < d.numDays; ++c) {
            b = a[c].firstChild.dateValue;
            a[c].className += " " + this.getDateCls(b)
        }
    },
    getDateCls: function (d) {
        var b = "",
            f = 0,
            g = this;
        d = new Date(d);
        if (d.getMonth() !== this.getActive().getMonth()) {
            return
        }
        if (this.getDayOverrides().getOverrideDay(d)) {
            b += (" " + this.overriddenDayCls);
            if (!this.getDayOverrides().isWorkingDay(d)) {
                b += (" " + this.nonWorkingDayCls)
            }
        } else {
            var e = null;
            this.getWeekOverrides().each(function (h) {
                if (Ext.Date.between(d, h.getStartDate(), h.getEndDate())) {
                    e = h;
                    return true
                }
            });
            if (e) {
                b += (" " + this.overriddenWeekDayCls);
                var c = new Date(d).getDay(),
                    a = e.getAvailability();
                if (a && a[c] && a[c].getIsWorkingDay() === false) {
                    b += (" " + g.nonWorkingDayCls)
                }
            } else {
                if (!this.getDayOverrides().isWorkingDay(d)) {
                    b += (" " + this.nonWorkingDayCls)
                }
            }
        }
        return b.length > 0 ? b : this.workingDayCls
    },
    removeCustomCls: function () {
        this.cells.removeCls([this.overriddenDayCls, this.nonWorkingDayCls, this.workingDayCls, this.overriddenWeekDayCls])
    }
});
Ext.define("Gnt.widget.calendar.Calendar", {
    extend: "Ext.form.Panel",
    requires: ["Ext.XTemplate", "Gnt.data.Calendar", "Gnt.widget.calendar.DayGrid", "Gnt.widget.calendar.WeekGrid", "Gnt.widget.calendar.DayAvailabilityGrid", "Gnt.widget.calendar.WeekEditor", "Gnt.widget.calendar.DatePicker"],
    alias: "widget.calendar",
    defaults: {
        padding: 10,
        border: false
    },
    workingDayCls: "gnt-datepicker-workingday",
    nonWorkingDayCls: "gnt-datepicker-nonworkingday",
    overriddenDayCls: "gnt-datepicker-overriddenday",
    overriddenWeekDayCls: "gnt-datepicker-overriddenweekday",
    calendar: null,
    dayOverrideNameHeaderText: "Name",
    dateText: "Date",
    addText: "Add",
    editText: "Edit",
    removeText: "Remove",
    workingDayText: "Working day",
    weekendsText: "Weekends",
    overriddenDayText: "Overridden day",
    overriddenWeekText: "Overridden week",
    defaultTimeText: "Default time",
    workingTimeText: "Working time",
    nonworkingTimeText: "Non-working time",
    dayGridConfig: null,
    weekGridConfig: null,
    datePickerConfig: null,
    dayOverridesText: "Day overrides",
    weekOverridesText: "Week overrides",
    okText: "OK",
    cancelText: "Cancel",
    dayGrid: null,
    weekGrid: null,
    getDayGrid: function () {
        if (!this.dayGrid) {
            this.dayGrid = Ext.create("Gnt.widget.calendar.DayGrid", Ext.apply({
                tbar: [{
                    text: this.addText,
                    action: "add",
                    iconCls: "gnt-action-add",
                    handler: this.addDay,
                    scope: this
                }, {
                    text: this.editText,
                    action: "edit",
                    iconCls: "gnt-action-edit",
                    handler: this.editDay,
                    scope: this
                }, {
                    text: this.removeText,
                    action: "remove",
                    iconCls: "gnt-action-remove",
                    handler: this.removeDay,
                    scope: this
                }]
            }, this.dayGridConfig || {}))
        }
        return this.dayGrid
    },
    getWeekGrid: function () {
        if (!this.weekGrid) {
            this.weekGrid = Ext.create("Gnt.widget.calendar.WeekGrid", Ext.apply({
                tbar: [{
                    text: this.addText,
                    action: "add",
                    iconCls: "gnt-action-add",
                    handler: this.addWeek,
                    scope: this
                }, {
                    text: this.editText,
                    action: "edit",
                    iconCls: "gnt-action-edit",
                    handler: this.editWeek,
                    scope: this
                }, {
                    text: this.removeText,
                    action: "remove",
                    iconCls: "gnt-action-remove",
                    handler: this.removeWeek,
                    scope: this
                }]
            }, this.weekGridConfig || {}))
        }
        return this.weekGrid
    },
    datePicker: null,
    getDatePicker: function () {
        if (!this.datePicker) {
            this.datePicker = Ext.create("Gnt.widget.calendar.DatePicker", this.datePickerConfig || {})
        }
        return this.datePicker
    },
    legendTpl: '<ul class="gnt-calendar-legend"><li class="gnt-calendar-legend-item"><div class="gnt-calendar-legend-itemstyle {workingDayCls}"></div><span class="gnt-calendar-legend-itemname">{workingDayText}</span><div style="clear: both"></div></li><li><div class="gnt-calendar-legend-itemstyle {nonWorkingDayCls}"></div><span class="gnt-calendar-legend-itemname">{weekendsText}</span><div style="clear: both"></div></li><li class="gnt-calendar-legend-override"><div class="gnt-calendar-legend-itemstyle {overriddenDayCls}">31</div><span class="gnt-calendar-legend-itemname">{overriddenDayText}</span><div style="clear: both"></div></li><li class="gnt-calendar-legend-override"><div class="gnt-calendar-legend-itemstyle {overriddenWeekDayCls}">31</div><span class="gnt-calendar-legend-itemname">{overriddenWeekText}</span><div style="clear: both"></div></li></ul>',
    dateInfoTpl: '<tpl if="isWorkingDay == true"><div>Working hours for {date}:</div></tpl><tpl if="isWorkingDay == false"><div>{date} is non-working</div></tpl><ul class="gnt-calendar-availabilities"><tpl for="availability"><li>{.}</li></tpl></ul><span>Based on: <tpl if="override == true">override "{name}" in calendar "{calendarName}"</tpl><tpl if="override == false">standard day in calendar "{calendarName}"</tpl></span>',
    initComponent: function () {
        var d = this;
        if (!(this.legendTpl instanceof Ext.Template)) {
            this.legendTpl = new Ext.XTemplate(this.legendTpl)
        }
        if (!(this.dateInfoTpl instanceof Ext.Template)) {
            this.dateInfoTpl = new Ext.XTemplate(this.dateInfoTpl)
        }
        if (!this.calendar) {
            Ext.Error.raise('Required attribute "calendar" is missed during initialization of `Gnt.widget.Calendar`')
        }
        var b = this.getWeekGrid(),
            a = this.getDayGrid(),
            c = this.getDatePicker();
        this.dayGrid.on({
            selectionchange: this.onDayGridSelectionChange,
            validateedit: this.onDayGridValidateEdit,
            edit: this.onDayGridEdit,
            scope: this
        });
        this.dayGrid.store.on({
            update: this.refreshView,
            remove: this.refreshView,
            add: this.refreshView,
            scope: this
        });
        this.weekGrid.on({
            selectionchange: this.onWeekGridSelectionChange,
            validateedit: this.onWeekGridValidateEdit,
            edit: this.onWeekGridEdit,
            scope: this
        });
        this.weekGrid.store.on({
            update: this.refreshView,
            remove: this.refreshView,
            add: this.refreshView,
            scope: this
        });
        this.datePicker.on({
            select: this.onDateSelect,
            scope: this
        });
        this.fillDaysStore();
        this.fillWeeksStore();
        c.setWeekOverrides(b.getStore());
        c.setDayOverrides(a.getStore());
        this.dateInfoPanel = new Ext.Panel({
            cls: "gnt-calendar-dateinfo",
            columnWidth: 0.33,
            border: false,
            height: 200
        });
        this.items = [{
            xtype: "container",
            layout: "hbox",
            pack: "start",
            align: "stretch",
            items: [{
                html: Ext.String.format('Calendar name: "{0}"', this.calendar.name),
                border: false,
                flex: 1
            }, {
                xtype: "combobox",
                name: "cmb_parentCalendar",
                fieldLabel: "Parent calendar",
                store: Ext.create("Ext.data.Store", {
                    fields: ["Id", "Name"],
                    data: [{
                        Id: -1,
                        Name: "No parent"
                    }].concat(d.calendar.getParentableCalendars())
                }),
                queryMode: "local",
                displayField: "Name",
                valueField: "Id",
                editable: false,
                emptyText: "Select parent",
                value: d.calendar.parent ? d.calendar.parent.calendarId : -1,
                flex: 1
            }]
        }, {
            layout: "column",
            defaults: {
                border: false
            },
            items: [{
                margin: "0 15px 0 0",
                columnWidth: 0.3,
                html: this.legendTpl.apply({
                    workingDayText: this.workingDayText,
                    weekendsText: this.weekendsText,
                    overriddenDayText: this.overriddenDayText,
                    overriddenWeekText: this.overriddenWeekText,
                    workingDayCls: this.workingDayCls,
                    nonWorkingDayCls: this.nonWorkingDayCls,
                    overriddenDayCls: this.overriddenDayCls,
                    overriddenWeekDayCls: this.overriddenWeekDayCls
                })
            }, {
                columnWidth: 0.37,
                margin: "0 5px 0 0",
                items: c
            },
            this.dateInfoPanel]
        }, {
            xtype: "tabpanel",
            items: [a, b]
        }];
        this.callParent(arguments)
    },
    onRender: function () {
        this.onDateSelect(this.getDatePicker(), new Date());
        this.callParent(arguments)
    },
    fillDaysStore: function () {
        var a = [];
        this.calendar.each(function (b) {
            if (!b.getDate()) {
                return
            }
            a.push(Ext.create("Gnt.model.CalendarDay", {
                Date: b.getDate(),
                Id: b.getId(),
                Name: b.getName(),
                IsWorkingDay: b.getIsWorkingDay(),
                Availability: b.getAvailability()
            }))
        });
        this.getDayGrid().getStore().loadData(a)
    },
    fillWeeksStore: function () {
        var c = [],
            b = this,
            a = this.getWeekGrid().store.model.prototype;
        Ext.Array.each(this.calendar.nonStandardWeeksStartDates, function (e) {
            var g = b.calendar.getNonStandardWeekByStartDate(e);
            var f = {};
            var d = b.calendar.getDefaultWeekAvailability();
            f[a.nameField] = g.name;
            f[a.startDateField] = g.startDate;
            f[a.endDateField] = g.endDate;
            f[a.availabilityField] = d;
            Ext.Array.each(d, function (h) {
                h.setName(g.name);
                h.clearDate(null)
            });
            Ext.Array.each(g.weekAvailability, function (k) {
                var l = k.getId();
                var j = /^(\d)-(\d\d\d\d\/\d\d\/\d\d)-(\d\d\d\d\/\d\d\/\d\d)$/.exec(l);
                if (!j) {
                    return
                }
                var i = j[1];
                var h = Ext.create("Gnt.model.CalendarDay");
                h.clearDate(null);
                h.setId(l);
                h.setName(g.name);
                h.setIsWorkingDay(k.getIsWorkingDay());
                h.setAvailability(k.getAvailability());
                d[i] = h
            });
            c.push(f)
        });
        this.getWeekGrid().getStore().loadData(c)
    },
    reload: function () {
        var b = this.getWeekGrid(),
            a = this.getDayGrid();
        this.fillDaysStore();
        this.fillWeeksStore();
        this.getDatePicker().setWeekOverrides(b.getStore());
        this.getDatePicker().setDayOverrides(a.getStore())
    },
    editDay: function () {
        var c = this,
            e = this.getDayGrid().getSelectionModel();
        if (!e || e.getSelection().length === 0) {
            return
        }
        var a = e.getSelection()[0];
        var b = new Gnt.widget.calendar.DayAvailabilityGrid({
            addText: this.addText,
            removeText: this.removeText,
            workingTimeText: this.workingTimeText,
            nonworkingTimeText: this.nonworkingTimeText
        });
        var d = Ext.create("Ext.window.Window", {
            title: this.dayOverridesText,
            modal: true,
            width: 280,
            height: 260,
            layout: "fit",
            items: b,
            buttons: [{
                text: this.okText,
                handler: function () {
                    c.calendar.clearCache();
                    if (b.isValid()) {
                        var f = b.calendarDay;
                        f.setIsWorkingDay(b.isWorkingDay());
                        f.setAvailability(b.getIntervals());
                        c.applyCalendarDay(f, a);
                        c.refreshView();
                        d.close()
                    }
                }
            }, {
                text: this.cancelText,
                handler: function () {
                    d.close()
                }
            }]
        });
        b.editAvailability(this.cloneCalendarDay(a));
        d.show()
    },
    addDay: function () {
        var a = this.getDatePicker().getValue(),
            b = this.getDayGrid(),
            c = Ext.create("Gnt.model.CalendarDay", {
                Name: "[Without name]",
                Cls: this.calendar.defaultNonWorkingTimeCssCls,
                Date: a,
                IsWorkingDay: false
            });
        b.getStore().insert(0, c);
        b.getSelectionModel().select([c], false, false)
    },
    removeDay: function () {
        var f = this.getDayGrid(),
            h = f.getSelectionModel(),
            c = f.getStore();
        if (!h || h.getSelection().length === 0) {
            return
        }
        c.clearCache();
        var a = h.getSelection()[0],
            d = this.getDatePicker().getValue(),
            g = d.getDay(),
            b = this.getWeekOverrideDay(d),
            e = b != null;
        c.remove(a);
        if (b == null) {
            b = this.calendar.defaultWeekAvailability[g]
        }
        this.getDatePicker().setValue(d)
    },
    refreshView: function () {
        var e = this.getDatePicker().getValue(),
            b = this.getCalendarDay(e),
            d = this.getWeekGrid(),
            a = this.getDayGrid(),
            c = a.getStore().getOverrideDay(e),
            g;
        if (c) {
            a.getSelectionModel().select([c], false, true)
        } else {
            g = this.getWeekOverrideByDate(e);
            if (g) {
                d.getSelectionModel().select([g], false, true)
            }
        }
        var f = {
            name: b.getName(),
            date: Ext.Date.format(e, "M j, Y"),
            calendarName: this.calendar.name || this.calendar.calendarId,
            availability: b.getAvailability(true),
            override: !! (c || g),
            isWorkingDay: b.getIsWorkingDay()
        };
        this.dateInfoPanel.update(this.dateInfoTpl.apply(f))
    },
    onDayGridSelectionChange: function (d) {
        if (!d || d.getSelection().length === 0) {
            return
        }
        var a = d.getSelection()[0],
            b = a.getDate(),
            c = this.getDayGrid();
        this.getDatePicker().setValue(b)
    },
    onDayGridEdit: function (b, c) {
        if (c.field === "Date") {
            var a = Ext.Date.clearTime(c.value, true);
            c.record.data[c.record.idProperty] = a - 0;
            c.grid.getStore().clearCache();
            this.getDatePicker().setValue(c.value)
        }
        this.refreshView()
    },
    onDayGridValidateEdit: function (b, c) {
        var a = c.grid.getStore();
        if (c.field === a.model.prototype.dateField && a.getOverrideDay(c.value) && c.value !== c.originalValue) {
            Ext.MessageBox.alert("Error", "There is already an override for this day");
            return false
        }
    },
    onDateSelect: function (b, a) {
        this.refreshView()
    },
    getCalendarDay: function (b) {
        var a = this.getOverrideDay(b);
        if (a) {
            return a
        }
        a = this.getWeekOverrideDay(b);
        if (a) {
            return a
        }
        return this.calendar.defaultWeekAvailability[b.getDay()]
    },
    getOverrideDay: function (a) {
        return this.getDayGrid().getStore().getOverrideDay(a)
    },
    getWeekOverrideDay: function (c) {
        var e = new Date(c),
            d = this.getWeekOverrideByDate(c),
            b = e.getDay();
        if (d == null) {
            return null
        }
        var a = d.getAvailability();
        if (!a) {
            return null
        }
        return a[b]
    },
    getWeekOverrideByDate: function (a) {
        var b = null;
        this.getWeekGrid().getStore().each(function (c) {
            if (Ext.Date.between(a, c.getStartDate(), c.getEndDate())) {
                b = c;
                return true
            }
        });
        return b
    },
    editWeek: function () {
        var f = this.getWeekGrid().getSelectionModel(),
            c = this;
        if (!f || f.getSelection().length === 0) {
            return
        }
        var b = f.getSelection()[0];
        var a = new Gnt.widget.calendar.WeekEditor({
            getDefaultWeekAvailabilityHandler: function () {
                return c.getDefaultWeekAvailability()
            }
        });
        var e = Ext.create("Ext.window.Window", {
            title: this.weekOverridesText,
            modal: true,
            width: 370,
            defaults: {
                border: false
            },
            layout: "fit",
            items: a,
            buttons: [{
                text: this.okText,
                handler: function () {
                    c.calendar.clearCache();
                    a.applyChanges(function (g) {
                        b.setAvailability(g);
                        var i = c.getDatePicker().getValue(),
                            h = g[i.getDay()];
                        c.refreshView();
                        e.close()
                    })
                }
            }, {
                text: this.cancelText,
                handler: function () {
                    e.close()
                }
            }]
        });
        var d = [];
        Ext.Array.each(b.getAvailability(), function (g) {
            d.push(c.cloneCalendarDay(g))
        });
        e.show();
        e.down("calendarweekeditor").editAvailability(b.getStartDate(), b.getEndDate(), d)
    },
    addWeek: function () {
        var a = this.getWeekGrid().getStore();
        var b = this.getDatePicker().getValue(),
            c = new a.model();
        c.setName("[Without name]");
        c.setStartDate(b);
        c.setEndDate(b);
        c.setAvailability(this.calendar.getDefaultWeekAvailability());
        a.insert(0, c);
        this.getWeekGrid().getSelectionModel().select([c], false, false)
    },
    removeWeek: function () {
        var f = this.getWeekGrid().getSelectionModel();
        if (!f || f.getSelection().length === 0) {
            return
        }
        var a = f.getSelection()[0],
            c = this.getDatePicker().getValue(),
            e = c.getDay(),
            b = this.getOverrideDay(c),
            d = !! b;
        b = b || this.calendar.defaultWeekAvailability[e];
        this.getWeekGrid().getStore().remove(a);
        this.getDatePicker().setValue(c);
        this.refreshView()
    },
    onWeekGridSelectionChange: function (e) {
        if (!e || e.getSelection().length === 0) {
            return
        }
        var a = e.getSelection()[0],
            b = a.getStartDate(),
            f = b.getDay(),
            d = a.getAvailability()[f],
            c = this.getWeekGrid();
        if (d == null) {
            d = this.calendar.defaultWeekAvailability[f]
        }
        this.getDatePicker().setValue(b)
    },
    onWeekGridEdit: function (f, h) {
        var c = h.record,
            a = c.getStartDate(),
            d = c.getEndDate(),
            i = a.getDay(),
            b = c.getAvailability(),
            k = b[i];
        prot = h.grid.getStore().model.prototype;
        if (k == null) {
            k = this.calendar.defaultWeekAvailability[i]
        }
        if (h.field == prot.startDateField || h.field == prot.endDateField) {
            var g = Ext.Date.format(a, "Y/m/d");
            var j = Ext.Date.format(d, "Y/m/d");
            Ext.Array.each(b, function (l) {
                var m = l.getId();
                var e = /^(\d)-(\d\d\d\d\/\d\d\/\d\d)-(\d\d\d\d\/\d\d\/\d\d)$/.exec(m);
                if (!e) {
                    return
                }
                l.set("Id", Ext.String.format("{0}-{1}-{2}", e[1], g, j))
            });
            this.getDatePicker().setValue(a)
        }
        this.refreshView()
    },
    onWeekGridValidateEdit: function (f, i) {
        var c = i.record,
            b = c.getStartDate(),
            h = c.getEndDate(),
            a = true;
        var d = i.grid.getStore();
        var g = d.model.prototype;
        if ((i.field === g.startDateField && h < i.value || i.field === g.endDateField && b > i.value)) {
            Ext.MessageBox.alert("Error", "StartDate greater then EndDate");
            return false
        }
        d.each(function (j) {
            var k = j.getStartDate(),
                e = j.getEndDate();
            if (k == b && e == h) {
                return
            }
            if ((i.field == g.startDateField && k < b && i.value <= e) || (i.field == g.endDateField && e > h && i.value >= k)) {
                a = false;
                return true
            }
        });
        if (!a) {
            Ext.MessageBox.alert("Error", "Dates shouldn't intersect");
            return false
        }
    },
    applyChanges: function (b) {
        var a = this.down('combobox[name="cmb_parentCalendar"]').getValue();
        this.calendar.parent = a ? Gnt.data.Calendar.getCalendar(a) : null;
        this.calendar.proxy.extraParams.parentId = this.calendar.parent ? this.calendar.parent.calendarId : null;
        this.applyDays();
        this.applyWeeks();
        if (b && Ext.isFunction(b)) {
            b.call(this, this.calendar)
        }
    },
    applyCalendarDay: function (b, a) {
        a.beginEdit();
        a.setId(b.getId());
        a.setName(b.getName());
        a.setIsWorkingDay(b.getIsWorkingDay());
        a.setDate(b.getDate());
        a.setAvailability(b.getAvailability());
        a.endEdit()
    },
    applyWeek: function (d, c) {
        var b = this,
            a = /^(\d)-(\d\d\d\d\/\d\d\/\d\d)-(\d\d\d\d\/\d\d\/\d\d)$/;
        Ext.Array.each(d.getAvailability(), function (f, h) {
            var i = false,
                g = f.getId(),
                e = a.exec(g) ? false : true;
            Ext.Array.each(c.weekAvailability, function (j) {
                var l = j.getId(),
                    k = a.exec(l);
                if (k[1] == h) {
                    if (e) {
                        b.calendar.remove(j)
                    } else {
                        b.applyCalendarDay(f, j)
                    }
                    i = true;
                    return i
                }
            });
            if (!i && !e) {
                b.calendar.add(f)
            }
        })
    },
    applyWeeks: function () {
        var c = this,
            b = this.getWeekGrid().getStore(),
            a = [],
            e = [],
            d = [];
        Ext.Array.each(this.calendar.nonStandardWeeksStartDates, function (f) {
            var g = false;
            b.each(function (i) {
                var h = Ext.Date.clearTime(i.getStartDate());
                if (h === f) {
                    var j = c.calendar.getNonStandardWeekByDate(f);
                    j.endDate == i.getEndDate() ? e.push([i, j]) : a.push(f);
                    g = true;
                    return true
                }
            });
            if (!g) {
                a.push(f)
            }
        });
        b.each(function (f) {
            if (c.calendar.getNonStandardWeekByDate(f.getStartDate() == null)) {
                d.push(f)
            }
        });
        Ext.Array.each(a, function (f) {
            c.calendar.removeNonStandardWeek(f)
        });
        Ext.Array.each(d, function (f) {
            c.calendar.addNonStandardWeek(f.getStartDate(), f.getEndDate(), f.getAvailability())
        });
        Ext.Array.each(e, function (f) {
            c.applyWeek(f[0], f[1])
        })
    },
    applyDays: function () {
        var c = this,
            b = this.getDayGrid().getStore(),
            a = [],
            e = [],
            d = [];
        this.calendar.each(function (f) {
            var g = /^(\d)-(\d\d\d\d\/\d\d\/\d\d)-(\d\d\d\d\/\d\d\/\d\d)$/.exec(f.getId());
            if (g) {
                return
            }
            b.getOverrideDay(f.getDate()) == null ? a.push(f) : e.push(f)
        });
        b.each(function (f) {
            if (c.calendar.getOverrideDay(f.getDate()) == null) {
                d.push(f)
            }
        });
        this.calendar.remove(a);
        this.calendar.add(d);
        Ext.Array.each(e, function (f) {
            var g = b.getOverrideDay(f.getDate());
            c.applyCalendarDay(g, f)
        })
    },
    cloneCalendarDay: function (a) {
        return Ext.create("Gnt.model.CalendarDay", {
            Date: a.getDate(),
            Id: a.getId(),
            Name: a.getName(),
            IsWorkingDay: a.getIsWorkingDay(),
            Availability: a.getAvailability()
        })
    },
    getDefaultWeekAvailability: function () {
        return this.calendar.defaultWeekAvailability
    },
    onDestroy: function () {
        this.getWeekGrid().destroy();
        this.getDayGrid().destroy();
        this.getDatePicker().destroy();
        this.callParent(arguments)
    }
});
//Ext.onReady(function () {
//    if (window.location.href.match("bryntum.com|ext-scheduler.com")) {
//        return
//    } else {
//        if (Sch && Sch.view && Sch.view.TimelineGridView) {
//            var b = false;
//            Sch.view.TimelineGridView.override({
//                refresh: function () {
//                    this.callOverridden(arguments);
//                    if (b || !this.rendered) {
//                        return
//                    }
//                    b = true;
//                    Ext.Function.defer(function () {
//                        this.el.select(this.eventSelector).setOpacity(0.15)
//                    }, 10 * 60 * 1000, this);
//                    var c = this.el.parent().createChild({
//                        tag: "a",
//                        href: "http://www.bryntum.com/store",
//                        title: "Click here to purchase a license",
//                        style: "display:block;height:54px;width:230px;background: #fff url(http://www.bryntum.com/site-images/bryntum-trial.png) no-repeat;z-index:10000;border:1px solid #ddd;-webkit-box-shadow: 2px 2px 2px rgba(100, 100, 100, 0.5);-moz-box-shadow: 2px 2px 2px rgba(100, 100, 100, 0.5);-moz-border-radius:5px;-webkit-border-radius:5px;position:absolute;bottom:10px;right:15px;"
//                    });
//                    try {
//                        if (!Ext.util.Cookies.get("bmeval")) {
//                            Ext.util.Cookies.set("bmeval", new Date().getTime(), Ext.Date.add(new Date(), Ext.Date.YEAR, 2))
//                        } else {
//                            var g = Ext.util.Cookies.get("bmeval"),
//                                d = new Date(parseInt(g, 10));
//                            if (Ext.Date.add(d, Ext.Date.DAY, 45) < new Date()) {
//                                this.el.select(this.eventSelector).hide();
//                                this.el.mask("Trial Period Expired!").setStyle("z-index", 10000);
//                                this.refresh = Ext.emptyFn
//                            }
//                        }
//                    } catch (f) {}
//                }
//            })
//        }
//        if (Sch && Sch.view && Sch.view.TimelineTreeView) {
//            var a = false;
//            Sch.view.TimelineTreeView.override({
//                refresh: function () {
//                    this.callOverridden(arguments);
//                    if (a || !this.rendered) {
//                        return
//                    }
//                    a = true;
//                    Ext.Function.defer(function () {
//                        this.el.select(this.eventSelector).setOpacity(0.15)
//                    }, 10 * 60 * 1000, this);
//                    var c = this.el.parent().createChild({
//                        tag: "a",
//                        href: "http://www.bryntum.com/store",
//                        title: "Click here to purchase a license",
//                        style: "display:block;height:54px;width:230px;background: #fff url(http://www.bryntum.com/site-images/bryntum-trial.png) no-repeat;z-index:10000;border:1px solid #ddd;-webkit-box-shadow: 2px 2px 2px rgba(100, 100, 100, 0.5);-moz-box-shadow: 2px 2px 2px rgba(100, 100, 100, 0.5);-moz-border-radius:5px;-webkit-border-radius:5px;position:absolute;bottom:10px;right:15px;"
//                    });
//                    Ext.Function.defer(c.fadeOut, 10000, c);
//                    try {
//                        if (!Ext.util.Cookies.get("bmeval")) {
//                            Ext.util.Cookies.set("bmeval", new Date().getTime(), Ext.Date.add(new Date(), Ext.Date.YEAR, 2))
//                        } else {
//                            var g = Ext.util.Cookies.get("bmeval"),
//                                d = new Date(parseInt(g, 10));
//                            if (Ext.Date.add(d, Ext.Date.DAY, 45) < new Date()) {
//                                this.el.select(this.eventSelector).hide();
//                                this.el.mask("Trial Period Expired!").setStyle("z-index", 10000);
//                                this.refresh = Ext.emptyFn
//                            }
//                        }
//                    } catch (f) {}
//                }
//            })
//        }
//    }
//});
Ext.data.Connection.override({
    parseStatus: function (b) {
        var a = this.callOverridden(arguments);
        if (b === 0) {
            a.success = true
        }
        return a
    }
});
//Ext.onReady(function () {
//    window._gaq = window._gaq || [];
//    window._gaq.push(["_setAccount", "UA-11046863-1"]);
//    window._gaq.push(["_setDomainName", "none"]);
//    window._gaq.push(["_setAllowLinker", true]);
//    window._gaq.push(["_trackPageview"]);
//    (function () {
//        var b = document.createElement("script");
//        b.type = "text/javascript";
//        b.async = true;
//        b.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
//        var a = document.getElementsByTagName("script")[0];
//        a.parentNode.insertBefore(b, a)
//    })();
//    window.onerror = function (h, c, a) {
//        if (!window.__reported && h && (a || c)) {
//            window.__reported = true;
//            try {
//                var b = new Image();
//                var g = Ext.versions && Ext.versions.extjs && Ext.versions.extjs.version;
//                var f = Sch.VERSION || "-";
//                b.src = Ext.String.format("http://bryntum.com/errlog.php?msg={0}&url={1}&line={2}&href={3}&extVersion={4}&prodVersion={5}&magic={6}", encodeURIComponent(h), encodeURIComponent(c), encodeURIComponent(a), encodeURIComponent(window.location.href), encodeURIComponent(g), encodeURIComponent(f), "maFSiO6W")
//            } catch (d) {}
//        }
//    }
//});