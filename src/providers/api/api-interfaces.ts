interface Challenge {
  id: string;
  projectID: string;
  challengeType: string;
  description: string;
  image: Image;
  answers: string[];
}

interface Image {
  fileName: string;
  fileExtension: string;
  height: number;
  width: number;
  url: string;
}

interface Annotation {
  challengeID: string,
  answer: string,
  latitude: number,
  longitude: number,
  localTime: string
}