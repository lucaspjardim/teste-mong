import React, { useEffect, useState } from 'react';
import { useLoading } from '../../context/LoadingContext';
import Loader from '../Loader/Loader';
import RankingModal from '../Modal/RankingModal/index';
import { SectionTitle, MatchesContainer, TitleModality, ButtonGroup, Button, RankingTable, RankingRow, RankingCell, MedalIcon } from './styles';

function XadrezMatches() {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedModality, setSelectedModality] = useState('');
  const [rankings, setRankings] = useState([]);
  const { setIsLoading } = useLoading();
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  const years = ["6° Ano", "7° Ano", "8° Ano", "9° Ano", "1° Série EM", "2° Série EM", "3° Série EM"];
  const modalities = ["xadrez_masculino", "xadrez_feminino"];

  useEffect(() => {
    if (selectedYear && selectedModality) {
      setIsLoading(true);

      fetch(`${apiUrl}/api/scores?modality=${selectedModality}&year=${encodeURIComponent(selectedYear)}`)
        .then(response => response.json())
        .then(data => {
          const sortedRankings = data.sort((a, b) => a.position - b.position);
          setRankings(sortedRankings);
        })
        .catch(error => console.error('Erro ao carregar o ranking:', error))
        .finally(() => setIsLoading(false));

      setIsRankingOpen(false);
    } else {
      setRankings([]);
    }
  }, [selectedYear, selectedModality, apiUrl, setIsLoading]);

  const toggleRankingModal = () => {
    setIsRankingOpen(!isRankingOpen);
  };

  const getMedalIcon = (position) => {
    if (position === 1) return <MedalIcon color="#FFD700">🥇</MedalIcon>; // Medalha de Ouro
    if (position === 2) return <MedalIcon color="#C0C0C0">🥈</MedalIcon>; // Medalha de Prata
    if (position === 3) return <MedalIcon color="#CD7F32">🥉</MedalIcon>; // Medalha de Bronze
    return position; // Posição normal para os outros
  };

  return (
    <div className="container">
      <TitleModality>Xadrez</TitleModality>
      <Loader />
      <ButtonGroup>
        {years.map((year) => (
          <Button
            key={year}
            className={selectedYear === year ? 'active' : ''}
            onClick={() => {
              setSelectedYear(year);
              setSelectedModality('');
            }}
          >
            {year}
          </Button>
        ))}
      </ButtonGroup>

      {selectedYear && (
        <ButtonGroup>
          {modalities.map((modality) => (
            <Button
              key={modality}
              className={selectedModality === modality ? 'active' : ''}
              onClick={() => setSelectedModality(modality)}
            >
              {modality === 'xadrez_masculino' ? 'Xadrez Masculino' : 'Xadrez Feminino'}
            </Button>
          ))}
        </ButtonGroup>
      )}

      {selectedYear && selectedModality ? (
        rankings.length > 0 ? (
          <MatchesContainer>
            <SectionTitle>Ranking de {selectedModality === 'xadrez_masculino' ? 'Xadrez Masculino' : 'Xadrez Feminino'} do {selectedYear}</SectionTitle>
            <RankingTable>
              <thead>
                <tr>
                  <RankingCell>Posição</RankingCell>
                  <RankingCell>Equipe</RankingCell>
                  <RankingCell>Pontos</RankingCell>
                </tr>
              </thead>
              <tbody>
                {rankings.map((team, index) => (
                  <RankingRow key={team.team}>
                    <RankingCell>{getMedalIcon(team.position)}</RankingCell>
                    <RankingCell>{team.team}</RankingCell>
                    <RankingCell>{team.points}</RankingCell>
                  </RankingRow>
                ))}
              </tbody>
            </RankingTable>
          </MatchesContainer>
        ) : (
          <SectionTitle>Nenhum ranking encontrado para {selectedYear} na modalidade {selectedModality === 'xadrez_masculino' ? 'Xadrez Masculino' : 'Xadrez Feminino'}</SectionTitle>
        )
      ) : (
        !selectedYear && <SectionTitle>Nenhum ano selecionado</SectionTitle>
      )}

      <RankingModal
        isOpen={isRankingOpen}
        onClose={toggleRankingModal}
        year={selectedYear}
        modality={selectedModality}
      />
    </div>
  );
}

export default XadrezMatches;
