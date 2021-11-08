import React from "react";
import { View, Text } from "react-native";
import { StyleSheet, FlatList } from "react-native";
import { Card, Paragraph } from "react-native-paper";
import { meditations, MeditationItem } from "../../data/meditations";

export default function Home({ navigation }) {
  const renderPopularCard = ({ item }) => {
    return (
      <Card
        elevation={1}
        style={styles.card}
        onPress={() =>
          navigation.navigate("Play", {
            id: item.id,
          })
        }
      >
        <Card.Cover
          style={[styles.cardImage, styles.popularImage]}
          source={item.image}
        />
        <Card.Title
          titleStyle={[styles.cardTitle, { color: "gray" }]}
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
          navigation.navigate("PlayScreen", {
            id: item.id,
          })
        }
      >
        <Card.Cover style={styles.cardImage} source={item.image} />
        <Card.Title
          titleStyle={[styles.cardTitle, { color: "gray" }]}
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

  return (
    <View>
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
      {/* {favourites.length > 0 && (
        <>
          <Text style={styles.title}>FAVOURITE</Text>
          <FlatList
            style={styles.cards}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={favourites}
            renderItem={renderCard}
            keyExtractor={({ id }) => id}
          />
        </>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 250,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
  },
  cardImage: {
    height: 135,
  },
  popularImage: {
    height: 250,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardSubtitle: {
    color: "gray",
    fontSize: 14,
  },
  cardParagraph: {
    color: "gray",
    fontWeight: "600",
  },
  downloadButton: {
    position: "relative",
    top: -6,
  },
  cards: {
    marginBottom: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 19,
  },
});
