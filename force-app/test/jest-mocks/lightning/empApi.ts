// noinspection JSUnusedGlobalSymbols

let _mockIsEmpEnabled = true;
let _mockErrorCallback: (arg0: any) => void;
let _mockSubscribeError: any;
let _mockSubscribeCallback: (arg0: any) => void;

// empApi methods mocks
const isEmpEnabled = jest.fn(() => Promise.resolve(_mockIsEmpEnabled));

const setDebugFlag = jest.fn(() => {});

const onError = jest.fn((callback) => {
    _mockErrorCallback = callback;
});

const subscribe = jest.fn((_channel, _replayId, callback) => {
    if (_mockSubscribeError) {
        return Promise.reject(_mockSubscribeError);
    }
    _mockSubscribeCallback = callback;
    return Promise.resolve();
});

const unsubscribe = jest.fn(() => {});

// Mock empApi object
export { isEmpEnabled, setDebugFlag, onError, subscribe, unsubscribe };

// Extra mock control methods
const resetMock = () => {
    _mockIsEmpEnabled = true;
    _mockErrorCallback = undefined;
    _mockSubscribeError = undefined;
    _mockSubscribeCallback = undefined;
};

const setMockEmpEnabled = (isEnabled: boolean) => {
    _mockIsEmpEnabled = isEnabled;
};

const fireMockError = (error: any) => {
    _mockErrorCallback(error);
};

const setMockSubscribeError = (error: any) => {
    _mockSubscribeError = error;
};

const fireMockEvent = (event: any) => {
    _mockSubscribeCallback(event);
};

export const empApiMock = {
    resetMock,
    setMockEmpEnabled,
    fireMockError,
    setMockSubscribeError,
    fireMockEvent
};
