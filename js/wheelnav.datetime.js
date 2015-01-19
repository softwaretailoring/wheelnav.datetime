/* ==============================================================================================  */
/*                                   wheelnav.datetime.js - v0.1.0                                 */
/* ==============================================================================================  */
/* This is a small javascript library for wheel based date and time.                               */
/* Requires wheelnav.js library (http://wheelnavjs.softwaretailoring.net)                          */
/* ==============================================================================================  */
/* Check http://wheelnavjs.softwaretailoring.net/datetime for samples.                             */
/* Fork https://github.com/softwaretailoring/wheelnav.datetime for contribution.                   */
/* =============================================================================================== */
/* Copyright © 2015 Gábor Berkesi (http://softwaretailoring.net)                                   */
/* Licensed under MIT (https://github.com/softwaretailoring/wheelnav.datetime/blob/master/LICENSE) */
/* =============================================================================================== */

wheelnavdatetime = function (divId) {

    this.divId = divId;

    this.wheelTypes = {
        Null: "Null",
        Menu: "Menu",
        Donut: "Donut"
    };

    this.wheelnavYear = null;
    this.wheelnavMonth = null;
    this.wheelnavDay = null;
    this.wheelnavHour = null;
    this.wheelnavMin = null;
    this.wheelnavSec = null;

    this.selectionEnable = false;
    this.timeVisible = true;
    this.fixDate = false;
    this.fixTime = false;
    this.slicePathType = this.wheelTypes.Menu;
    this.percentYearMin = 0;
    this.percentYearMax = 0.15;
    this.percentMonthMin = 0.15;
    this.percentMonthMax = 0.3;
    this.percentDayMin = 0.3;
    this.percentDayMax = 0.4;
    this.percentHourMin = 0.4;
    this.percentHourMax = 0.6;
    this.percentMinMin = 0.6;
    this.percentMinMax = 0.8;
    this.percentSecMin = 0.8;
    this.percentSecMax = 0.97;
};

wheelnavdatetime.prototype.initWheelNav = function (wheelnav, minPercent, maxPercent, sliceType, fixed) {

    wheelnav.slicePathCustom = new slicePathCustomization();
    wheelnav.sliceSelectedPathCustom = new slicePathCustomization();
    wheelnav.sliceHoverPathCustom = new slicePathCustomization();

    if (sliceType == this.wheelTypes.Donut) {
        wheelnav.slicePathFunction = slicePath().DonutSlice;
        wheelnav.slicePathCustom.minRadiusPercent = minPercent;
        wheelnav.slicePathCustom.maxRadiusPercent = maxPercent;

        wheelnav.sliceSelectedPathCustom.minRadiusPercent = minPercent;
        wheelnav.sliceSelectedPathCustom.maxRadiusPercent = maxPercent;
    }
    if (sliceType == this.wheelTypes.Menu) {
        wheelnav.slicePathFunction = slicePath().MenuSliceWithoutLine;
        wheelnav.slicePathCustom.titleRadiusPercent = minPercent + ((maxPercent - minPercent) / 2);
        wheelnav.slicePathCustom.menuRadius = ((maxPercent * wheelnav.wheelRadius) - (minPercent * wheelnav.wheelRadius)) / 2;

        wheelnav.sliceSelectedPathCustom.titleRadiusPercent = wheelnav.slicePathCustom.titleRadiusPercent;
        wheelnav.sliceSelectedPathCustom.menuRadius = wheelnav.slicePathCustom.menuRadius * 1.3;

        wheelnav.sliceHoverPathCustom.titleRadiusPercent = wheelnav.slicePathCustom.titleRadiusPercent;
        wheelnav.sliceHoverPathCustom.menuRadius = wheelnav.slicePathCustom.menuRadius * 0.8;
    }
    if (sliceType == this.wheelTypes.Null) {
        wheelnav.slicePathFunction = slicePath().NullSlice;
        wheelnav.slicePathCustom.titleRadiusPercent = minPercent + ((maxPercent - minPercent) / 2);

        wheelnav.sliceSelectedPathCustom.titleRadiusPercent = wheelnav.slicePathCustom.titleRadiusPercent;

        wheelnav.sliceHoverPathCustom.titleRadiusPercent = wheelnav.slicePathCustom.titleRadiusPercent;
    }

    wheelnav.colors = new Array("#EEE");

    wheelnav.slicePathAttr = { fill: "#EEE", stroke: "#111", "stroke-width": 3, cursor: 'pointer', opacity: 0.2 };
    wheelnav.sliceSelectedAttr = { fill: "#111", stroke: "#111", "stroke-width": 4, cursor: 'default', opacity: 1 };

    wheelnav.titleAttr = { font: '100 20px Impact, Charcoal, sans-serif', fill: "#111", stroke: "none", cursor: 'pointer', opacity: 0.2 };
    wheelnav.titleSelectedAttr = { font: '100 20px Impact, Charcoal, sans-serif', fill: "#FFF", cursor: 'default', opacity: 1 };

    wheelnav.animateeffect = "linear";
    wheelnav.navItemsEnabled = this.selectionEnable;
    wheelnav.clickModeRotate = !fixed;

    if (!fixed) {
        wheelnav.navAngle = 0;
    }
    else {
        wheelnav.navAngle = -90;
    }

    if (this.selectionEnable) {
        wheelnav.animatetime = 1000;
    }
    else {
        wheelnav.animatetime = 0;
    }
};

wheelnavdatetime.prototype.createWheelNav = function () {
    this.wheelnavYear = new wheelnav(this.divId);
    this.initWheelNav(this.wheelnavYear, this.percentYearMin, this.percentYearMax, this.slicePathType, this.fixDate);

    this.wheelnavMonth = new wheelnav(this.divId + "Month", this.wheelnavYear.raphael);
    this.initWheelNav(this.wheelnavMonth, this.percentMonthMin, this.percentMonthMax, this.slicePathType, this.fixDate);

    this.wheelnavDay = new wheelnav(this.divId + "Day", this.wheelnavYear.raphael);
    this.initWheelNav(this.wheelnavDay, this.percentDayMin, this.percentDayMax, this.slicePathType, this.fixDate);

    this.wheelnavYear.createWheel(["2015", null]);
    this.wheelnavMonth.createWheel(["jan", "feb", "marc", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]);
    this.wheelnavDay.createWheel(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]);

    if (this.timeVisible) {
        this.wheelnavHour = new wheelnav(this.divId + "Hour", this.wheelnavYear.raphael);
        this.initWheelNav(this.wheelnavHour, this.percentHourMin, this.percentHourMax, this.slicePathType, this.fixTime);

        this.wheelnavMin = new wheelnav(this.divId + "Min", this.wheelnavYear.raphael);
        this.initWheelNav(this.wheelnavMin, this.percentMinMin, this.percentMinMax, this.slicePathType, this.fixTime);

        this.wheelnavSec = new wheelnav(this.divId + "Sec", this.wheelnavYear.raphael);
        this.initWheelNav(this.wheelnavSec, this.percentSecMin, this.percentSecMax, this.slicePathType, this.fixTime);

        this.wheelnavHour.createWheel(["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]);
        this.wheelnavMin.createWheel(["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"]);
        this.wheelnavSec.createWheel(["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"]);
    }
};

wheelnavdatetime.prototype.setDateTime = function () {
    var today = new Date();
    var mo = parseInt(today.getMonth());
    var d = parseInt(today.getDate());
    var h = parseInt(today.getHours());
    var m = parseInt(today.getMinutes());
    var s = parseInt(today.getSeconds());
    
    if (this.wheelnavMonth.selectedNavItemIndex !== mo) {
        this.wheelnavMonth.navigateWheel(3);
    }
    if (this.wheelnavDay.selectedNavItemIndex !== d - 1) {
        this.wheelnavDay.navigateWheel(d - 1);
    }

    if (this.timeVisible) {
        if (this.wheelnavHour.selectedNavItemIndex !== h) {
            this.wheelnavHour.navigateWheel(h);
        }
        if (this.wheelnavMin.selectedNavItemIndex !== m) {
            this.wheelnavMin.navigateWheel(m);
        }
        if (this.wheelnavSec.selectedNavItemIndex !== s) {
            this.wheelnavSec.navigateWheel(s);
        }
    }

    if (!this.selectionEnable) {
        var thisDateTime = this;
        var t = setTimeout(function () { thisDateTime.setDateTime() }, 0);
    }
};

