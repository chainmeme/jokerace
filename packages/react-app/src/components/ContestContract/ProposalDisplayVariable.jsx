import { Button, Col, Divider, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";

import { tryToDisplay } from "./utils";
import AddressProposalVotes from "./AddressProposalVotes";

const ProposalDisplayVariable = ({ 
            proposalId, proposalTotalVotes,
            getProposalContractFunction, getProposalFunctionInfo, 
            addressesVotedContractFunction, addressesVotedFunctionInfo,
            proposalAddressVotesContractFunction, proposalAddressVotesFunctionInfo,
            refreshRequired, triggerRefresh, blockExplorer, provider }) => {
  const [proposalContent, setProposalContent] = useState([]);
  const [addressesVoted, setAddressesVoted] = useState([]);

  const refresh = useCallback(async () => {
    try {
      const getProposalResponse = await getProposalContractFunction(proposalId);
      const addressesVotedResponse = await addressesVotedContractFunction(proposalId);
      setProposalContent(getProposalResponse);
      setAddressesVoted(addressesVotedResponse)
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setProposalContent, getProposalContractFunction,
         addressesVotedContractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, getProposalContractFunction, addressesVotedContractFunction]);

  return (
    <div>
      <Row>
        <Col
          span={8}
          style={{
            textAlign: "right",
            opacity: 0.333,
            paddingRight: 6,
            fontSize: 24,
          }}
        >
          {getProposalFunctionInfo[1].name}
        </Col>
        <Col span={14}>
          {/* It is second (proposalContent[1]) in the array because that's what the struct is for a Proposal: id, content, author */}
          <h2>{tryToDisplay(proposalContent[1], false, blockExplorer)}</h2>
          <h2>Total Votes: {tryToDisplay(proposalTotalVotes, false, blockExplorer)}</h2>
          {addressesVoted.map(userAddress => <AddressProposalVotes 
            proposalId={proposalId}
            userAddress={userAddress}
            proposalAddressVotesContractFunction={proposalAddressVotesContractFunction}
            proposalAddressVotesFunctionInfo={proposalAddressVotesFunctionInfo}
            refreshRequired={refreshRequired}
            triggerRefresh={triggerRefresh}
            blockExplorer={blockExplorer}
            provider={provider}/>)}
        </Col>
        <Col span={2}>
          <h2>
            <Button type="link" onClick={refresh} icon="🔄" />
          </h2>
        </Col>
      </Row>
      <Divider />
    </div>
  );
};

export default ProposalDisplayVariable;
