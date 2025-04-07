import React from 'react';
import ResearchDataModule from '../modules/ResearchDataModule';

describe('ResearchDataModule', () => {
  test('module exports correct structure', () => {
    expect(ResearchDataModule).toHaveProperty('id', 'research-data');
    expect(ResearchDataModule).toHaveProperty('name', 'Research & Data');
    expect(ResearchDataModule).toHaveProperty('description');
    expect(ResearchDataModule).toHaveProperty('menuItems');
    expect(ResearchDataModule).toHaveProperty('component');
    expect(ResearchDataModule).toHaveProperty('alertsEnabled');
    
    expect(ResearchDataModule.menuItems.length).toBeGreaterThan(0);
  });
});