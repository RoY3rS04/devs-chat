import ImageKit from "imagekit";

const imageKit = () => {

    return new ImageKit({
        publicKey: 'public_yhefXBWs3XFNTqogiGTMvK53aOs=',
        privateKey: process.env.IMAGE_KIT_KEY,
        urlEndpoint: process.env.IMAGE_KIT_URL
    })

}


export default imageKit;