import React from 'react';
import { Box, Typography, Card, CardContent, CardActionArea, Grid, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

type SearchType = 'hybrid' | 'keyword' | 'concept';

interface SearchTypeSelectorProps {
    value: SearchType;
    onChange: (value: SearchType) => void;
}

const SearchTypeSelector: React.FC<SearchTypeSelectorProps> = ({ value, onChange }) => {
    const options = [
        {
            type: 'keyword' as SearchType,
            title: 'Keyword Search',
            icon: <SearchIcon sx={{ fontSize: 38, color: value === 'keyword' ? '#fff' : '#333' }} />,
            tooltip: 'Direct text matching'
        },
        {
            type: 'concept' as SearchType,
            title: 'Concept Search',
            icon: <PsychologyIcon sx={{ fontSize: 38, color: value === 'concept' ? '#fff' : '#333' }} />,
            tooltip: 'AI-powered search that understands concepts and context'
        },
        {
            type: 'hybrid' as SearchType,
            title: 'Hybrid Search',
            icon: <AutoAwesomeIcon sx={{ fontSize: 38, color: value === 'hybrid' ? '#fff' : '#333' }} />,
            tooltip: 'Comprehensive search using both direct matching and AI concept understanding'
        }
    ];

    return (
        <Box sx={{ mb: 1.5, mt: 0.5 }}>
            <Typography variant="subtitle2" sx={{ mb: 0, fontWeight: 600, fontSize: '1rem' }}>
            Search Type
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
            (Please select one option from below)
            </Typography>
            <Grid container spacing={2}>
            {options.map((option) => (
            <Grid item xs={12} sm={4} key={option.type}>
            <Tooltip title={option.tooltip} placement="top" arrow>
                    <Card 
                    elevation={1} 
                    sx={{ 
                        height: '100px',
                        width: '95%',
                        transition: 'all 0.3s ease',
                        transform: value === option.type ? 'translateY(-1px)' : 'none',
                        backgroundColor: value === option.type ? '#0CBC8B' : '#fff',
                        color: value === option.type ? '#fff' : 'inherit',
                        border: value === option.type ? '1px solid #0CBC8B' : '1px solid #e0e0e0',
                        '&:hover': {
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        borderColor: '#0CBC8B',
                        }
                    }}
                    >
                    <CardActionArea 
                        onClick={() => onChange(option.type)}
                        sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 0.5
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.3 }}>
                        {option.icon}
                        </Box>
                        <CardContent sx={{ 
                        width: '100%', 
                        textAlign: 'center',
                        p: 0.3,
                        '&:last-child': { pb: 0.3 } 
                        }}>
                        <Typography variant="body2" component="div" sx={{ fontWeight: 600, mb: 0.3, fontSize: '0.85rem' }}>
                            {option.title}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 500 }} color={value === option.type ? 'rgba(255,255,255,0.9)' : 'text.secondary'}>
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                    </Card>
                </Tooltip>
                </Grid>
            ))}
            </Grid>
        </Box>
    );
};

export default SearchTypeSelector;