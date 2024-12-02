import React from 'react';
import NewsFeed from '../screens/NewsFeed';
import ArticleDetail from '../screens/ArticleDetail';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

interface Article {
  url: string;
  title: string;
  description: string;
  urlToImage: string;
}

type RootStackParamList = {
  NewsFeed: undefined;
  ArticleDetail: { article: Article };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center', // Centers the title for all screens
        }}
        initialRouteName="NewsFeed">
        <Stack.Screen options={{
          title: 'News'
        }} name="NewsFeed" component={NewsFeed} />
        <Stack.Screen options={{ title: 'Article Details' }} name="ArticleDetail" component={ArticleDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
