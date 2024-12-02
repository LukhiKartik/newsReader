import React from 'react';
import {
  ScrollView,
  Text,
  Image,
  Button,
  StyleSheet,
  Dimensions,
  View,
  Share,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';

type Article = {
  title: string;
  content: string;
  description: string;
  urlToImage: string;
};

type ArticleDetailScreenProps = {
  route: RouteProp<{ params: { article: Article } }, 'params'>;
};

const { width } = Dimensions.get('window');

const ImageLoader = ({
  source,
  style,
}: {
  source: {uri: string};
  style: object;
}) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <View style={[style, styles.imageContainer]}>
      {loading && !error && <ActivityIndicator style={styles.loader} />}
      <Image
        source={source} // Fallback image if loading fails
        style={[style, {opacity: loading ? 0 : 1}]}
        onLoadEnd={() => setLoading(false)}
        onError={() => setError(true)}
        resizeMode="cover"
      />
    </View>
  );
};

const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({ route }) => {
  const article = route.params?.article;

  // Use description as fallback if content is truncated
  const articleContent = article.content.includes('[+')
    ? article.description
    : article.content;

  // Handle Share functionality
  const handleShare = async () => {
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${articleContent}`,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageLoader source={{uri: article.urlToImage}} style={styles.image} />
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.content}>{articleContent}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Share" onPress={handleShare} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  image: {
    width: width * 0.9, // Responsive width (90% of the screen)
    height: width * 0.5, // Aspect ratio 16:9
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: width * 0.06, // Responsive font size
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  content: {
    fontSize: width * 0.04, // Responsive font size
    lineHeight: width * 0.06,
    marginBottom: 20,
    textAlign: 'justify',
  },
  buttonContainer: {
    alignSelf: 'center',
    width: '100%',
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ArticleDetailScreen;
