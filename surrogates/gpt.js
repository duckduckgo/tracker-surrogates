(() => {
    'use strict';

    const noop = () => {};
    const noopReturnNull = () => null;
    const noopReturnEmptyArray = () => [];
    const noopReturnEmptyString = () => '';
    const noopReturnThis = function () { return this; };

    const passbackTarget = Object.assign(Object.create(null), {
        display: noop,
        get: noopReturnNull
    });

    let targeting = Object.create(null);

    function setTargeting(key, value) {
        const val = Array.isArray(value) ? value : [value];
        targeting[key] = val;
    }

    function getTargeting(key) {
        return key in targeting ? targeting[key] : [];
    }

    function getTargetingKeys() {
        return Object.keys(targeting);
    }

    function clearTargeting(key) {
        if (key) {
            targeting[key] = [];
        } else {
            targeting = Object.create(null);
        }
    }

    const pubadsProto = {};
    const pubadsTarget = Object.assign(Object.create(pubadsProto), {
        addEventListener: noopReturnThis,
        clearCategoryExclusions: noopReturnThis,
        clearTagForChildDirectedTreatment: noopReturnThis,
        clearTargeting,
        definePassback: () => passbackTarget,
        defineOutOfPagePassback: () => passbackTarget,
        get: noopReturnNull,
        getAttributeKeys: noopReturnEmptyArray,
        getTargetingKeys,
        getSlots: noopReturnEmptyArray,
        prebidders: [],
        set: noopReturnThis,
        setCategoryExclusion: noopReturnThis,
        setCookieOptions: noopReturnThis,
        setForceSafeFrame: noopReturnThis,
        setLocation: noopReturnThis,
        setPublisherProvidedId: noopReturnThis,
        setRequestNonPersonalizedAds: noopReturnThis,
        setSafeFrameConfig: noopReturnThis,
        setTagForChildDirectedTreatment: noopReturnThis,
        setTargeting,
        getTargeting,
        setVideoContent: noopReturnThis,
        enableSingleRequest: noopReturnThis,
        collapseEmptyDivs: noopReturnThis,
        refresh: noopReturnThis,
        disableInitialLoad: noopReturnThis,
        enableAsyncRendering: noopReturnThis,
        enableLazyLoad: noopReturnThis,
        updateCorrelator: noopReturnThis
    });

    const companionadsTarget = Object.assign(Object.create(null), {
        addEventListener: noopReturnThis
    });

    const sizeMappingTarget = Object.assign(Object.create(null), {
        addSize: noopReturnThis,
        build: noopReturnNull
    });

    const contentTarget = Object.assign(Object.create(null), {
        addEventListener: noopReturnThis
    });

    const slotTarget = Object.assign(Object.create(null), {
        addService: noopReturnThis,
        defineSizeMapping: noopReturnThis,
        get: noopReturnNull,
        getAdUnitPath: noopReturnEmptyString,
        getAttributeKeys: noopReturnEmptyArray,
        getCategoryExclusions: noopReturnEmptyArray,
        getDomId: noopReturnEmptyString,
        getSlotElementId: noopReturnEmptyString,
        getTargeting,
        getTargetingKeys,
        setTargeting,
        clearTargeting,
        setCollapseEmptyDiv: noopReturnThis,
        setSafeFrameConfig: noopReturnThis,
        setForceSafeFrame: noopReturnThis
    });

    const gptObj = Object.assign(Object.create(null), {
        _loadStarted_: true,
        apiReady: true,
        pubadsReady: true,
        cmd: [],
        pubads: () => pubadsTarget,
        companionAds: () => companionadsTarget,
        sizeMapping: () => sizeMappingTarget,
        content: () => contentTarget,
        defineSlot: () => slotTarget,
        defineOutOfPageSlot: () => slotTarget,
        defineUnit: noopReturnNull,
        destroySlots: noop,
        disablePublisherConsole: noop,
        display: noop,
        enableServices: noop,
        getVersion: noopReturnEmptyString,
        setAdIframeTitle: noop
    });

    const commandQueue = (window.googletag && window.googletag.cmd.length) ? window.googletag.cmd : [];

    gptObj.cmd.push = function (arg) {
        if (typeof arg === 'function') {
            try {
                arg();
            } catch (error) {
                // Silently catch errors
            }
        }
        return 1;
    };

    window.googletag = gptObj;

    while (commandQueue.length > 0) {
        gptObj.cmd.push(commandQueue.shift());
    }
})();
