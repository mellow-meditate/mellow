import React from 'react';
import { ScrollView, Text } from 'react-native';
import { StyleSheet, FlatList } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import { meditations } from '../../data/meditations';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home({ navigation }) {
  const renderPopularCard = ({ item }) => {
    return (
      <Card
        elevation={1}
        style={styles.card}
        onPress={() =>
          navigation.navigate('Play', {
            id: item.id,
          })
        }
      >
        <Card.Cover
          style={[styles.cardImage, styles.popularImage]}
          source={{ uri: item.image }}
        />
        <Card.Title
          titleStyle={[styles.cardTitle]}
          subtitleStyle={styles.cardSubtitle}
          title={item.title}
          subtitle={item.subtitle}
        />
        <Card.Content style={styles.cardContent}>
          <Paragraph style={styles.cardParagraph}>
            {item.time} minutes
          </Paragraph>
          {/* <DownloadButton id={item.id} style={styles.downloadButton} /> */}
        </Card.Content>
      </Card>
    );
  };

  const renderCard = ({ item }) => {
    return (
      <Card
        style={styles.card}
        onPress={() =>
          navigation.navigate('Play', {
            id: item.id,
          })
        }
      >
        <Card.Cover style={styles.cardImage} source={{ uri: item.image }} />
        <Card.Title
          titleStyle={[styles.cardTitle]}
          subtitleStyle={styles.cardSubtitle}
          title={item.title}
          subtitle={item.subtitle}
        />
        <Card.Content style={styles.cardContent}>
          <Text style={styles.cardParagraph}>{item.time} minutes</Text>
          {/* <DownloadButton id={item.id} style={styles.downloadButton} /> */}
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.view}>
      <LinearGradient
        colors={['#000428', '#004e92']}
        style={styles.background}
        start={[1, 1]}
      >
        <Text style={styles.title}>POPULAR</Text>
        <FlatList
          style={styles.cards}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={meditations.popular}
          renderItem={renderPopularCard}
          keyExtractor={({ id }) => id}
        />
        <Text style={styles.title}>ANXIETY</Text>
        <FlatList
          style={styles.cards}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={meditations.anxiety}
          renderItem={renderCard}
          keyExtractor={({ id }) => id}
        />
        <Text style={styles.title}>SLEEP</Text>
        <FlatList
          style={styles.cards}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={meditations.sleep}
          renderItem={renderCard}
          keyExtractor={({ id }) => id}
        />
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    height: '100%',
    paddingLeft: 17,
  },
  view: {
    // background: #000428;
    // background: -webkit-linear-gradient(to right, #004e92, #000428);
    // background: linear-gradient(to right, #004e92, #000428);
  },
  card: {
    backgroundColor: 'transparent',
    width: 250,
    marginRight: 30,
    height: 220,
    borderWidth: 0, // Remove Border

    shadowColor: 'rgba(0,0,0, 0.0)', // Remove Shadow for iOS
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,

    elevation: 0, // Remove Shadow for Android
    borderRadius: 20,
  },
  cardTitle: {
    marginLeft: -10,
    marginTop: -15,
    color: 'white',
    fontSize: 15,
  },
  cardImage: {
    height: 150,
    width: 250,
    borderRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  popularImage: {
    height: 150,
    width: 250,
    borderRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardSubtitle: {
    color: 'white',
    fontSize: 12,
    marginTop: -5,
    marginLeft: -10,
  },
  cardParagraph: {
    color: 'white',
    fontWeight: '100',
    fontSize: 12,
    marginTop: -20,
    marginLeft: -10,
  },
  downloadButton: {
    position: 'relative',
    top: -6,
  },
  cards: {
    marginBottom: 30,
  },
  title: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 19,
    color: 'white',
  },
});
