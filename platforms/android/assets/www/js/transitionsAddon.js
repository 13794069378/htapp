/**
 *  A transition addon for app framework.ui
 *  @Author Jiannan Aaron Cai
 *  @Date 2014-07-27
 */


/* global af*/
(function ($ui) {
    "use strict";
    /**
     * slide-right
     * @param {Object} previous panel
     * @param {Object} current panel
     * @param {Boolean} go back
     * @title $ui.slideTransition(previousPanel,currentPanel,goBack);
     */
    function slideRight(oldDiv, currDiv, back) {
        var that = this;
        that.css3animate(oldDiv, {
            x: "0%",
            y: "0%",
            complete: function () {
                that.css3animate(oldDiv, {
                    x: "100%",
                    time: $ui.transitionTime,
                    complete: function () {
                        that.finishTransition(oldDiv, currDiv);
                    }
                }).link(currDiv, {
                    x: "0%",
                    time: $ui.transitionTime
                });
            }
        }).link(currDiv, {
            x: "-100%",
            y: "0%"
        });
    }
    
    /**
     * slide-left
     * @param {Object} previous panel
     * @param {Object} current panel
     * @param {Boolean} go back
     * @title $ui.slideTransition(previousPanel,currentPanel,goBack);
     */
    function slideLeft(oldDiv, currDiv, back) {
        var that = this;
        that.css3animate(oldDiv, {
            x: "0%",
            y: "0%",
            complete: function () {
                that.css3animate(oldDiv, {
                    x: "-100%",
                    time: $ui.transitionTime,
                    complete: function () {
                        that.finishTransition(oldDiv, currDiv);
                    }
                }).link(currDiv, {
                    x: "0%",
                    time: $ui.transitionTime
                });
            }
        }).link(currDiv, {
            x: "100%",
            y: "0%"
        });
    }
   
    $ui.availableTransitions["slide-left"] = slideLeft;
    $ui.availableTransitions["slide-right"] = slideRight;
    
})(af.ui);