import { Alert } from "@mui/material";

interface StatusInfoPaneProps {
    isGameSuccessful: boolean;
    isGameUnsuccessful: boolean;
    errorMsg: string | null;
    detailedErrorMsg: string | null;
}

const StatusInfoPane = ({
    isGameSuccessful,
    isGameUnsuccessful,
    errorMsg,
    detailedErrorMsg
}: StatusInfoPaneProps) => {

    return (
        <div>
            {errorMsg && (
                <Alert severity="error">
                    <div>
                        {errorMsg}
                        {detailedErrorMsg && (
                            <>
                                <br />
                                {detailedErrorMsg}
                            </>
                        )}
                    </div>
                </Alert>
            )}

            {isGameSuccessful && <Alert severity="success">
                Yay! All Done
            </Alert>}

            {isGameUnsuccessful && <Alert severity="info">
                Game Over! Click below to play again.
            </Alert>}

        </div>
    );
};

export default StatusInfoPane;