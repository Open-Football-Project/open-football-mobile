const React = require('react');
const { View } = require('react-native');

const ViewShot = React.forwardRef(function ViewShot(props, ref) {
  React.useImperativeHandle(ref, () => ({
    capture: jest.fn().mockResolvedValue('file:///mock-capture.png'),
  }));
  return React.createElement(View, { testID: props.testID }, props.children);
});

module.exports = { __esModule: true, default: ViewShot };
