import React, { useState, useEffect } from "react";
import axios from "axios";
import { Heading, Text, Box, Button, Select, Input, Spinner } from "@chakra-ui/react";

const Home = () => {
    const [file, setFile] = useState(null);
    const [format, setFormat] = useState("mp3");
    // const [codec, setCodec] = useState("pcm_s16le");
    // const [bitrate, setBitrate] = useState("192k");
    // const [sampleRate, setSampleRate] = useState("44100");
    // const [channels, setChannels] = useState("2");
    // const [volume, setVolume] = useState("1.0");
    const [isLoading, setIsLoading] = useState(false);
    const [convertedFile, setConvertedFile] = useState(null);
    const [error, setError] = useState(null);

    const buttonStyles = { px: 10, flex: 1, mt: 10, colorScheme: "yellow" };

    useEffect(() => {
        document.title = "Audio Converter";
    }, []);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const allowedFormats = ["wav", "mp3", "flac", "aac", "ogg", "m4a", "wma", "webm", "opus", "aiff"];

        if (selectedFile) {
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
            if (!allowedFormats.includes(fileExtension)) {
                alert("Unsupported file format. Please upload a valid audio file.");
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setError(null); // Reset any previous errors
        }
    };

    const handleConvert = async () => {
        if (!file) {
            alert("Please upload a file first!");
            return;
        }
        setIsLoading(true);
        setError(null); // Reset error state

        const formData = new FormData();
        formData.append("file", file);
        formData.append("output_format", format);
        // formData.append("codec", codec);
        // formData.append("bitrate", bitrate);
        // formData.append("sample_rate", sampleRate);
        // formData.append("channels", channels);
        // formData.append("volume", volume);

        try {
            const response = await axios.post("http://127.0.0.1:5000/convert_audio", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setConvertedFile(response.data.output_file);
        } catch (error) {
            console.error("Error during file conversion:", error.response?.data || error.message);
            setError("File conversion failed. Please check the server or file compatibility.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!convertedFile) {
            alert("No file available for download.");
            return;
        }

        window.location.href = `http://127.0.0.1/download/${convertedFile}`;
    };

    return (
        <Box textAlign="center" p="6">
            <Heading as="h1" size="xl" mb="4">
                Audio Converter
            </Heading>
            <Text mb="4">Upload your audio file and convert it to the desired format!</Text>

            <Box border="2px dashed gray" p="4" mb="4" width="full" textAlign="center" borderRadius="md">
                <Text>Drag and drop your file here, or</Text>
                <Input type="file" onChange={handleFileChange} mt="2" />
            </Box>

            <Select placeholder="Select format" value={format} onChange={(e) => setFormat(e.target.value)} mb="4" width="full">
                <option value="mp3">MP3</option>
                <option value="wav">WAV</option>
                <option value="flac">FLAC</option>
                <option value="aac">AAC</option>
                <option value="ogg">OGG</option>
                <option value="m4a">M4A</option>
                <option value="opus">OPUS</option>
            </Select>

            {/* <Box mb="4">
                <Text>Codec:</Text>
                <Input value={codec} onChange={(e) => setCodec(e.target.value)} placeholder="Enter codec (e.g., pcm_s16le)" />
            </Box>
            <Box mb="4">
                <Text>Bitrate:</Text>
                <Input value={bitrate} onChange={(e) => setBitrate(e.target.value)} placeholder="Enter bitrate (e.g., 192k)" />
            </Box>
            <Box mb="4">
                <Text>Sample Rate:</Text>
                <Input value={sampleRate} onChange={(e) => setSampleRate(e.target.value)} placeholder="Enter sample rate (e.g., 44100)" />
            </Box>
            <Box mb="4">
                <Text>Channels:</Text>
                <Input value={channels} onChange={(e) => setChannels(e.target.value)} placeholder="Enter number of channels (e.g., 2)" />
            </Box>
            <Box mb="4">
                <Text>Volume Multiplier:</Text>
                <Input value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="Enter volume (e.g., 1.5)" />
            </Box> */}

            <Button onClick={handleConvert} {...buttonStyles} disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : `Convert to ${format}`}
            </Button>

            {error && (
                <Text color="red.500" mt="4">
                    {error}
                </Text>
            )}

            {convertedFile && (
                <Box mt="4">
                    <Text fontSize="sm">Download your converted file below:</Text>
                    <Button colorScheme="green" onClick={handleDownload} mt="2">
                        Download {convertedFile}
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default Home;

