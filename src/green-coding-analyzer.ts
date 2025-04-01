// green-coding-analyzer.ts
import * as ts from 'typescript';
import fs from 'fs';
import path from 'path';

export class GreenCodingAnalyzer {
    private readonly fileContent: string;
    private readonly sourceFile: ts.SourceFile;
    private score: number;
    private readonly issues: string[];

    constructor(private readonly filePath: string) {
        this.fileContent = fs.readFileSync(filePath, 'utf8');
        this.sourceFile = ts.createSourceFile(filePath, this.fileContent, ts.ScriptTarget.ESNext, true);
        this.score = 100;
        this.issues = [];
    }

    analyze(): { score: number; issues: string[] } {
        this.checkNodes(this.sourceFile);
        return { score: this.score, issues: this.issues };
    }

    private checkNodes(node: ts.Node) {
        this.detectAnyType(node);
        this.detectEmptyLoops(node);
        this.detectLargeFunctions(node);
        this.detectNestedLoops(node);
        this.detectApiCallsInLoops(node);
        this.detectUnusedVariables(node);
        ts.forEachChild(node, (child) => this.checkNodes(child));
    }

    private getLine(node: ts.Node): number {
        return this.sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
    }

    private detectAnyType(node: ts.Node) {
        if (ts.isVariableDeclaration(node) && node.type && node.type.kind === ts.SyntaxKind.AnyKeyword) {
            this.issues.push(`Avoid using 'any' type at line ${this.getLine(node)}`);
            this.score -= 5;
        }
    }

    private detectEmptyLoops(node: ts.Node) {
        if ((ts.isForStatement(node) || ts.isWhileStatement(node)) && ts.isBlock(node.statement) && node.statement.statements.length === 0) {
            this.issues.push(`Empty loop detected at line ${this.getLine(node)}`);
            this.score -= 10;
        }
    }

    private detectLargeFunctions(node: ts.Node) {
        if ((ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) && node.body && ts.isBlock(node.body) && node.body.statements.length > 50) {
            this.issues.push(`Function too large at line ${this.getLine(node)}. Consider breaking it down.`);
            this.score -= 10;
        }
    }

    private detectNestedLoops(node: ts.Node, depth = 0) {
        if (ts.isForStatement(node) || ts.isWhileStatement(node)) {
            depth++;
            if (depth > 3) {
                this.issues.push(`Deeply nested loop detected at line ${this.getLine(node)}`);
                this.score -= 10;
            }
        }
        ts.forEachChild(node, (child) => this.detectNestedLoops(child, depth));
    }

    private detectApiCallsInLoops(node: ts.Node) {
        if (ts.isCallExpression(node)) {
            const functionName = node.expression.getText(this.sourceFile);
            if (/fetch|axios|http/.test(functionName)) {
                let parent = node.parent;
                while (parent) {
                    if (ts.isForStatement(parent) || ts.isWhileStatement(parent)) {
                        this.issues.push(`API call inside loop at line ${this.getLine(node)}. Consider batching requests.`);
                        this.score -= 15;
                        break;
                    }
                    parent = parent.parent;
                }
            }
        }
    }

    private detectUnusedVariables(node: ts.Node) {
        if (ts.isVariableStatement(node)) {
            node.declarationList.declarations.forEach(declaration => {
                if (declaration.name && ts.isIdentifier(declaration.name)) {
                    const varName = declaration.name.text;
                    const regex = new RegExp(`\b${varName}\b`, 'g');
                    if (!regex.test(this.fileContent.replace(declaration.getText(this.sourceFile), ''))) {
                        this.issues.push(`Unused variable '${varName}' at line ${this.getLine(node)}`);
                        this.score -= 5;
                    }
                }
            });
        }
    }
}

// Run the analyzer on a given file
const filePath = process.argv[2];
if (!filePath) {
    console.error('Usage: ts-node green-coding-analyzer.ts <file.ts>');
    process.exit(1);
}

const fullPath = path.resolve(filePath);
const analyzer = new GreenCodingAnalyzer(fullPath);
const result = analyzer.analyze();

console.log(`\nGreen Coding Score: ${result.score}/100`);
if (result.issues.length) {
    console.log('Issues found:');
    result.issues.forEach(issue => console.log(`- ${issue}`));
} else {
    console.log('Great job! No issues found.');
}
