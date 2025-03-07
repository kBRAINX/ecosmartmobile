// components/maps/BinDetails.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { colors } from '../../constants/theme';

export default function BinDetails({ bin, wasteTypes = [], onClose, onGetDirections, userDistance }) {
  if (!bin) return null;

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <View>
            <Text style={styles.title}>{bin.name}</Text>
            <View style={styles.meta}>
                <View style={[
                styles.fillIndicator,
                {
                    backgroundColor:
                    bin.fillLevel < 50 ? '#22c55e' :
                    bin.fillLevel < 80 ? '#f59e0b' : '#ef4444'
                }
                ]} />
                <Text style={styles.metaText}>
                Fill level: {bin.fillLevel}% • Capacity: {bin.capacity}
                </Text>
            </View>
            </View>
            {userDistance && (
            <Text style={styles.distance}>{userDistance}</Text>
            )}
        </View>

        <View style={styles.types}>
            {bin.types.map(typeId => {
            const type = wasteTypes.find(t => t.id === typeId);
            return type ? (
                <Badge
                key={typeId}
                label={type.name}
                variant="outlined"
                color={type.color}
                style={styles.typeBadge}
                />
                ) : null;
            })}
        </View>

        <View style={styles.actions}>
            <Button
            title="Get Directions"
            onPress={onGetDirections}
            style={styles.directionsButton}
            icon={<Ionicons name="navigate" size={18} color="#fff" />}
            />
            <Button
            title="Close"
            variant="outlined"
            onPress={onClose}
            style={styles.closeButton}
            />
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    fillIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#666',
    },
    distance: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary,
    },
    types: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
        marginBottom: 8,
    },
    typeBadge: {
        margin: 2,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    directionsButton: {
        flex: 1,
        marginRight: 8,
        backgroundColor: colors.primary,
    },
    closeButton: {
        flex: 1,
    },
});
