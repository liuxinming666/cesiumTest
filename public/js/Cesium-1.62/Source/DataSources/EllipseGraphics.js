define([
        '../Core/defaultValue',
        '../Core/defined',
        '../Core/defineProperties',
        '../Core/DeveloperError',
        '../Core/Event',
        './createMaterialPropertyDescriptor',
        './createPropertyDescriptor'
    ], function(
        defaultValue,
        defined,
        defineProperties,
        DeveloperError,
        Event,
        createMaterialPropertyDescriptor,
        createPropertyDescriptor) {
    'use strict';

    /**
     * Describes an ellipse defined by a center point and semi-major and semi-minor axes.
     * The ellipse conforms to the curvature of the globe and can be placed on the surface or
     * at altitude and can optionally be extruded into a volume.
     * The center point is determined by the containing {@link Entity}.
     *
     * @alias EllipseGraphics
     * @constructor
     *
     * @param {Object} [options] Object with the following properties:
     * @param {Property} [options.show=true] A boolean Property specifying the visibility of the ellipse.
     * @param {Property} [options.semiMajorAxis] The numeric Property specifying the semi-major axis.
     * @param {Property} [options.semiMinorAxis] The numeric Property specifying the semi-minor axis.
     * @param {Property} [options.height=0] A numeric Property specifying the altitude of the ellipse relative to the ellipsoid surface.
     * @param {Property} [options.heightReference=HeightReference.NONE] A Property specifying what the height is relative to.
     * @param {Property} [options.extrudedHeight] A numeric Property specifying the altitude of the ellipse's extruded face relative to the ellipsoid surface.
     * @param {Property} [options.extrudedHeightReference=HeightReference.NONE] A Property specifying what the extrudedHeight is relative to.
     * @param {Property} [options.rotation=0.0] A numeric property specifying the rotation of the ellipse counter-clockwise from north.
     * @param {Property} [options.stRotation=0.0] A numeric property specifying the rotation of the ellipse texture counter-clockwise from north.
     * @param {Property} [options.granularity=Cesium.Math.RADIANS_PER_DEGREE] A numeric Property specifying the angular distance between points on the ellipse.
     * @param {Property} [options.fill=true] A boolean Property specifying whether the ellipse is filled with the provided material.
     * @param {MaterialProperty} [options.material=Color.WHITE] A Property specifying the material used to fill the ellipse.
     * @param {Property} [options.outline=false] A boolean Property specifying whether the ellipse is outlined.
     * @param {Property} [options.outlineColor=Color.BLACK] A Property specifying the {@link Color} of the outline.
     * @param {Property} [options.outlineWidth=1.0] A numeric Property specifying the width of the outline.
     * @param {Property} [options.numberOfVerticalLines=16] A numeric Property specifying the number of vertical lines to draw along the perimeter for the outline.
     * @param {Property} [options.shadows=ShadowMode.DISABLED] An enum Property specifying whether the ellipse casts or receives shadows from each light source.
     * @param {Property} [options.distanceDisplayCondition] A Property specifying at what distance from the camera that this ellipse will be displayed.
     * @param {Property} [options.classificationType=ClassificationType.BOTH] An enum Property specifying whether this ellipse will classify terrain, 3D Tiles, or both when on the ground.
     * @param {ConstantProperty} [options.zIndex=0] A property specifying the zIndex of the Ellipse.  Used for ordering ground geometry.  Only has an effect if the ellipse is constant and neither height or exturdedHeight are specified.
     *
     * @demo {@link https://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=Circles and Ellipses.html|Cesium Sandcastle Circles and Ellipses Demo}
     */
    function EllipseGraphics(options) {
        this._definitionChanged = new Event();
        this._show = undefined;
        this._showSubscription = undefined;
        this._semiMajorAxis = undefined;
        this._semiMajorAxisSubscription = undefined;
        this._semiMinorAxis = undefined;
        this._semiMinorAxisSubscription = undefined;
        this._height = undefined;
        this._heightSubscription = undefined;
        this._heightReference = undefined;
        this._heightReferenceSubscription = undefined;
        this._extrudedHeight = undefined;
        this._extrudedHeightSubscription = undefined;
        this._extrudedHeightReference = undefined;
        this._extrudedHeightReferenceSubscription = undefined;
        this._rotation = undefined;
        this._rotationSubscription = undefined;
        this._stRotation = undefined;
        this._stRotationSubscription = undefined;
        this._granularity = undefined;
        this._granularitySubscription = undefined;
        this._fill = undefined;
        this._fillSubscription = undefined;
        this._material = undefined;
        this._materialSubscription = undefined;
        this._outline = undefined;
        this._outlineSubscription = undefined;
        this._outlineColor = undefined;
        this._outlineColorSubscription = undefined;
        this._outlineWidth = undefined;
        this._outlineWidthSubscription = undefined;
        this._numberOfVerticalLines = undefined;
        this._numberOfVerticalLinesSubscription = undefined;
        this._shadows = undefined;
        this._shadowsSubscription = undefined;
        this._distanceDisplayCondition = undefined;
        this._distanceDisplayConditionSubscription = undefined;
        this._classificationType = undefined;
        this._classificationTypeSubscription = undefined;
        this._zIndex = undefined;
        this._zIndexSubscription = undefined;

        this.merge(defaultValue(options, defaultValue.EMPTY_OBJECT));
    }

    defineProperties(EllipseGraphics.prototype, {
        /**
         * Gets the event that is raised whenever a property or sub-property is changed or modified.
         * @memberof EllipseGraphics.prototype
         *
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },

        /**
         * Gets or sets the boolean Property specifying the visibility of the ellipse.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         * @default true
         */
        show : createPropertyDescriptor('show'),

        /**
         * Gets or sets the numeric Property specifying the semi-major axis.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         */
        semiMajorAxis : createPropertyDescriptor('semiMajorAxis'),

        /**
         * Gets or sets the numeric Property specifying the semi-minor axis.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         */
        semiMinorAxis : createPropertyDescriptor('semiMinorAxis'),

        /**
         * Gets or sets the numeric Property specifying the altitude of the ellipse.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         * @default 0.0
         */
        height : createPropertyDescriptor('height'),

        /**
         * Gets or sets the Property specifying the {@link HeightReference}.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         * @default HeightReference.NONE
         */
        heightReference : createPropertyDescriptor('heightReference'),

        /**
         * Gets or sets the numeric Property specifying the altitude of the ellipse extrusion.
         * Setting this property creates volume starting at height and ending at this altitude.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         */
        extrudedHeight : createPropertyDescriptor('extrudedHeight'),

        /**
         * Gets or sets the Property specifying the extruded {@link HeightReference}.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         * @default HeightReference.NONE
         */
        extrudedHeightReference : createPropertyDescriptor('extrudedHeightReference'),

        /**
         * Gets or sets the numeric property specifying the rotation of the ellipse clockwise from north.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         * @default 0
         */
        rotation : createPropertyDescriptor('rotation'),

        /**
         * Gets or sets the numeric property specifying the rotation of the ellipse texture counter-clockwise from north.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         * @default 0
         */
        stRotation : createPropertyDescriptor('stRotation'),

        /**
         * Gets or sets the numeric Property specifying the angular distance between points on the ellipse.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         * @default {CesiumMath.RADIANS_PER_DEGREE}
         */
        granularity : createPropertyDescriptor('granularity'),

        /**
         * Gets or sets the boolean Property specifying whether the ellipse is filled with the provided material.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         * @default true
         */
        fill : createPropertyDescriptor('fill'),

        /**
         * Gets or sets the Property specifying the material used to fill the ellipse.
         * @memberof EllipseGraphics.prototype
         * @type {MaterialProperty}
         * @default Color.WHITE
         */
        material : createMaterialPropertyDescriptor('material'),

        /**
         * Gets or sets the Property specifying whether the ellipse is outlined.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         * @default false
         */
        outline : createPropertyDescriptor('outline'),

        /**
         * Gets or sets the Property specifying the {@link Color} of the outline.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         * @default Color.BLACK
         */
        outlineColor : createPropertyDescriptor('outlineColor'),

        /**
         * Gets or sets the numeric Property specifying the width of the outline.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         * @default 1.0
         */
        outlineWidth : createPropertyDescriptor('outlineWidth'),

        /**
         * Gets or sets the numeric Property specifying the number of vertical lines to draw along the perimeter for the outline.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         * @default 16
         */
        numberOfVerticalLines : createPropertyDescriptor('numberOfVerticalLines'),

        /**
         * Get or sets the enum Property specifying whether the ellipse
         * casts or receives shadows from each light source.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         * @default ShadowMode.DISABLED
         */
        shadows : createPropertyDescriptor('shadows'),

        /**
         * Gets or sets the {@link DistanceDisplayCondition} Property specifying at what distance from the camera that this ellipse will be displayed.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         */
        distanceDisplayCondition : createPropertyDescriptor('distanceDisplayCondition'),

        /**
         * Gets or sets the {@link ClassificationType} Property specifying whether this ellipse will classify terrain, 3D Tiles, or both when on the ground.
         * @memberof EllipseGraphics.prototype
         * @type {Property}
         * @default ClassificationType.BOTH
         */
        classificationType : createPropertyDescriptor('classificationType'),

        /**
         * Gets or sets the zIndex Property specifying the ellipse ordering.  Only has an effect if the ellipse is constant and neither height or extrudedHeight are specified
         * @memberof EllipseGraphics.prototype
         * @type {ConstantProperty}
         * @default 0
         */
        zIndex : createPropertyDescriptor('zIndex')
    });

    /**
     * Duplicates this instance.
     *
     * @param {EllipseGraphics} [result] The object onto which to store the result.
     * @returns {EllipseGraphics} The modified result parameter or a new instance if one was not provided.
     */
    EllipseGraphics.prototype.clone = function(result) {
        if (!defined(result)) {
            return new EllipseGraphics(this);
        }
        result.show = this.show;
        result.semiMajorAxis = this.semiMajorAxis;
        result.semiMinorAxis = this.semiMinorAxis;
        result.height = this.height;
        result.heightReference = this.heightReference;
        result.extrudedHeight = this.extrudedHeight;
        result.extrudedHeightReference = this.extrudedHeightReference;
        result.rotation = this.rotation;
        result.stRotation = this.stRotation;
        result.granularity = this.granularity;
        result.fill = this.fill;
        result.material = this.material;
        result.outline = this.outline;
        result.outlineColor = this.outlineColor;
        result.outlineWidth = this.outlineWidth;
        result.numberOfVerticalLines = this.numberOfVerticalLines;
        result.shadows = this.shadows;
        result.distanceDisplayCondition = this.distanceDisplayCondition;
        result.classificationType = this.classificationType;
        result.zIndex = this.zIndex;
        return result;
    };

    /**
     * Assigns each unassigned property on this object to the value
     * of the same property on the provided source object.
     *
     * @param {EllipseGraphics} source The object to be merged into this object.
     */
    EllipseGraphics.prototype.merge = function(source) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(source)) {
            throw new DeveloperError('source is required.');
        }
        //>>includeEnd('debug');

        this.show = defaultValue(this.show, source.show);
        this.semiMajorAxis = defaultValue(this.semiMajorAxis, source.semiMajorAxis);
        this.semiMinorAxis = defaultValue(this.semiMinorAxis, source.semiMinorAxis);
        this.height = defaultValue(this.height, source.height);
        this.heightReference = defaultValue(this.heightReference, source.heightReference);
        this.extrudedHeight = defaultValue(this.extrudedHeight, source.extrudedHeight);
        this.extrudedHeightReference = defaultValue(this.extrudedHeightReference,  source.extrudedHeightReference);
        this.rotation = defaultValue(this.rotation, source.rotation);
        this.stRotation = defaultValue(this.stRotation, source.stRotation);
        this.granularity = defaultValue(this.granularity, source.granularity);
        this.fill = defaultValue(this.fill, source.fill);
        this.material = defaultValue(this.material, source.material);
        this.outline = defaultValue(this.outline, source.outline);
        this.outlineColor = defaultValue(this.outlineColor, source.outlineColor);
        this.outlineWidth = defaultValue(this.outlineWidth, source.outlineWidth);
        this.numberOfVerticalLines = defaultValue(this.numberOfVerticalLines, source.numberOfVerticalLines);
        this.shadows = defaultValue(this.shadows, source.shadows);
        this.distanceDisplayCondition = defaultValue(this.distanceDisplayCondition, source.distanceDisplayCondition);
        this.classificationType = defaultValue(this.classificationType, source.classificationType);
        this.zIndex = defaultValue(this.zIndex, source.zIndex);
    };

    return EllipseGraphics;
});