import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler'
import { COLORS, Images, SIZES, GlobalVariables } from '../constants/Index';

const CustomCam = (props) => {
    const { navigation, useGImgBase64 } = props
    const [image, setImage] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [hasPickerPermission, setHasPickerPermission] = useState(false);
    const [hasMediaPermission, setHasMediaPermission] = useState(false);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const cam = useRef();

    useEffect(() => {
        // console.log(props)
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            const pickerPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            const mediaPermission =  await MediaLibrary.requestPermissionsAsync();

            setHasCameraPermission(cameraPermission.status === "granted")
            setHasMediaPermission(mediaPermission.status === 'granted')
            setHasPickerPermission(pickerPermission.status === 'granted')
        })();

        // console.log(hasCameraPermission)
        // console.log(hasPickerPermission)
        // console.log(hasMediaPermission)


        //console.log(navigation)
    }, []);


    const takePicture = async () => {
        if (cam.current) {
            const option = { quality: 0.8, base64: true, skipProcessing: false }
            let photo = await cam.current.takePictureAsync(option);

            // console.log(cam.current.getSupportedRatiosAsync());
            const source = photo.uri
            const imgBase64 = photo.base64
            if (source && imgBase64) {
                //cam.current.pausePreview()
                if (useGImgBase64) {
                    GlobalVariables.imgBase64 = imgBase64;
                }

                // cam.current.resumePreview();
                handleSave(source)
                console.log("picture source", source);
            }
        }
    }

    const handleSave = async (photo) => {
        if (hasMediaPermission) {
            const asset = await MediaLibrary.createAssetAsync(photo);
            const assetWithInfo = await MediaLibrary.getAssetInfoAsync(asset.id)
            console.log(assetWithInfo.localUri)

            props.getImageUrl(assetWithInfo.localUri)
        } else {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
    }

    const handleBack = () => {
        navigation.goBack()
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
        });

        if (!result.canceled) {
            console.log(result.assets[0].uri)
            setImage(result.assets[0].uri);
            if (useGImgBase64) {
                GlobalVariables.imgBase64 = result.assets[0].base64;
            }

            // console.log(result.uri)

            props.getImageUrl(result.assets[0].uri)

        }
    }

    if (hasCameraPermission === null) {
        return (
            <View style={styles.container}>
                <Text>No access to camera</Text>
            </View>
        );
    }
    if (hasMediaPermission === false) {
        return (
            <View style={styles.container}>
                <Text>No access to Media</Text>
            </View>
        );
    }

    if (hasPickerPermission === false) {
        return (
            <View style={styles.container}>
                <Text>No access to picker</Text>
            </View>
        );
    }

    return (
        <View style={styles.camPageContainer}>

            <View style={styles.header}>
                <View style={styles.rowContainer}>
                    <TouchableOpacity
                        // style={{ borderWidth: 1 }}
                        onPress={handleBack}
                    //onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.headerText}>Take a picture</Text>
                </View>
            </View>
            <Camera
                ref={cam}
                style={styles.camera}
                type={type}
                autoFocus={Camera.Constants.AutoFocus.on}
            >
                <View
                    style={styles.basicCon}>
                    <Image
                        source={Images.focus}
                        resizeMode="stretch"
                        style={styles.focusSty}
                    />
                </View>

            </Camera>


            <View
                style={styles.footer}
            >
                <View style={styles.footerFirRow}>
                    <Text style={styles.footerText}>Pick Photo</Text>
                    <Text style={styles.footerText2}>Take Photo</Text>
                </View>

                <View
                    style={{
                        flex: 1,
                        // backgroundColor: "#000000",
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        marginTop: SIZES.padding * 2,
                    }}
                >
                    <TouchableOpacity
                        onPress={pickImage}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderRadius: 100
                            }}
                        >
                            <MaterialIcons name="perm-media" size={24} color="black" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}

                        onPress={takePicture}>
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderRadius: 100
                            }}
                        >
                            <Ionicons name="camera-outline" size={24} color="black" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

CustomCam.defaultProps = {
    onGetImage: () => { (value) => console.log("'Image: " + value) }
}

const styles = StyleSheet.create({
    footerFirRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        marginRight: 60
    },
    footerText2: {
        paddingLeft: 5
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        padding: SIZES.padding * 3,
        borderTopLeftRadius: SIZES.radius,
        borderTopRightRadius: SIZES.radius,
        backgroundColor: COLORS.white
    },
    basicCon: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    focusSty: {
        marginTop: "-25%",
        width: 300,
        height: 300
    },
    infobtn: {
        height: 45,
        width: 45,
        backgroundColor: COLORS.tertiary,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerText: {
        color: COLORS.black,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2.8,
        //paddingLeft: 75,
        paddingTop: Platform.OS == 'ios' ? 20 : 15,
        height: Platform.OS == 'ios' ? 50 : 45

    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center'
    },
    header: {
        flexDirection: 'row',
        marginTop: Platform.OS == 'ios' ? SIZES.padding * 4 : 0,
        paddingHorizontal: SIZES.padding * 3
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    camPageContainer: {
        flex: 1,
        backgroundColor: COLORS.transparent
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
})


export default CustomCam;