import React, { memo, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import NetInfo from '@react-native-community/netinfo';
import { fetchArticles } from '../redux/articlesSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface Article {
  url: string;
  title: string;
  description: string;
  urlToImage: string;
}

const ListItem = memo(
  ({
    article,
    onPress,
  }: {
    article: Article;
    onPress: (article: Article) => void;
  }) => (
    <TouchableOpacity
      onPress={() => onPress(article)}
      style={styles.itemContainer}
    >
      <ImageLoader source={{ uri: article.urlToImage }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {article.description}
        </Text>
      </View>
    </TouchableOpacity>
  )
);

const ImageLoader = ({
  source,
  style,
}: {
  source: { uri: string };
  style: object;
}) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <View style={[style, styles.imageContainer]}>
      {loading && !error && <ActivityIndicator style={styles.loader} />}
      <Image
        source={source}
        style={[style, { opacity: loading ? 0 : 1 }]}
        onLoadEnd={() => setLoading(false)}
        onError={() => setError(true)}
        resizeMode="cover"
      />
    </View>
  );
};

const NewsFeed: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.articles
  );
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(fetchArticles());
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Article }) => (
    <ListItem
      article={item}
      onPress={article =>
        navigation.navigate('ArticleDetail', { article: article })
      }
    />
  );

  return (
    <View style={styles.container}>
      {isOffline && (
        <Text style={styles.offlineText}>
          You are offline. Showing cached articles.
        </Text>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) =>
            item.urlToImage ? `${item.urlToImage}-${index}` : `key-${index}`
          }
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default NewsFeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    paddingHorizontal: width * 0.03, // 3% of the screen width
    paddingVertical: height * 0.01, // 1% of the screen height
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: height * 0.02, // 2% of the screen height
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2, // Shadow effect for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.25, // 25% of the screen width
    height: width * 0.25, // Maintain a square ratio
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textContainer: {
    flex: 2,
    paddingLeft: width * 0.03, // 3% of the screen width
  },
  title: {
    fontSize: width * 0.035, // 3.5% of the screen width
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: width * 0.035, // 3.5% of the screen width
    color: '#666',
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
  },
  offlineText: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});
