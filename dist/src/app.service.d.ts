export declare class AppService {
    private readonly logger;
    private readonly commitMessages;
    private readonly targetFile;
    constructor();
    handleCommits(): void;
    private calculateCommitCount;
    private executeCommits;
    private pushChanges;
}
