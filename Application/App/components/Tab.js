import React, { useRef } from 'react'
import { StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import { Transition, Transitioning } from 'react-native-reanimated'
import { Images } from '../constants/Index'

const bgColor = {
    Home: '#ffe1c5',
    Profile: '#999999',
    Setting: '#bce3fa',
}

const textColors = {
    Home: '#c56b14',
    Profile: "#111111",
    Setting: '#2d9cdb',
}

const Container = styled.TouchableWithoutFeedback``;
const Background = styled(Transitioning.View)`
    flex:auto;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: ${(props) => (props.focused ? bgColor[props.label] : 'white')};
    border-radius: 100px;
    margin: 6px;
`;
const Icon = styled.Image`
    height: 24px;
    width: 24px;
`;
const Label = styled.Text`
    color: ${(props) => textColors[props.label]};
    font-weight: 600;
    margin-left: 8px;
`;
// export default function Tab({ color, tab, onPress, icon }) {
export default function Tab({ label, accessibilityState, onPress }) {
    const focused = accessibilityState.selected
    const icon = !focused ? Images.icons[label] : Images.icons[`${label}Focused`]

    const transition = (
        <Transition.Sequence>
            <Transition.Out type="fade" durationMs={0} />
            <Transition.Change interpolation="easeInOut" durationMs={100} />
            <Transition.In type="fade" durationMs={10} />
        </Transition.Sequence>
    )

    const ref = useRef();
    return (
        <Container onPress={() => {
            ref.current.animateNextTransition();
            onPress();
        }}>
            <Background focused={focused} label={label} ref={ref} transition={transition}>
                <Icon source={icon} />
                {focused && <Label label={label}>{label}</Label>}
            </Background>

        </Container>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
    }
})
