/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright Contributors to the Zowe Project.
*
*/

import { ProgressLocation, window } from "vscode";
import { CICSPlexTree } from "../trees/CICSPlexTree";
import { CICSTree } from "../trees/CICSTree";

export function plexExpansionHandler(plex: CICSPlexTree, tree:CICSTree) {
    const plexProfile = plex.getProfile();
    if (plexProfile.profile!.regionName && plexProfile.profile!.cicsPlex) {
        if (!plex.getGroupName()) {
            // CICSRegion
            window.withProgress({
                title: 'Loading regions',
                location: ProgressLocation.Notification,
                cancellable: false
            }, async (_, token) => {
                token.onCancellationRequested(() => {
                console.log("Cancelling the loading of the regions");
                });
                await plex.loadOnlyRegion();
                tree._onDidChangeTreeData.fire(undefined);
            });
        } else {
            // CICSGroup
            window.withProgress({
                title: 'Loading regions',
                location: ProgressLocation.Notification,
                cancellable: false
            }, async (_, token) => {
                token.onCancellationRequested(() => {
                console.log("Cancelling the loading of regions");
                });
                plex.clearChildren();
                plex.addRegionContainer();
                plex.addNewCombinedTrees();
                tree._onDidChangeTreeData.fire(undefined);
            });
        }
    } else {
        window.withProgress({
            title: 'Loading regions',
            location: ProgressLocation.Notification,
            cancellable: false
        }, async (_, token) => {
        token.onCancellationRequested(() => {
            console.log("Cancelling the loading of regions");
        });
        plex.clearChildren();
        plex.addRegionContainer();
        plex.addNewCombinedTrees();
        tree._onDidChangeTreeData.fire(undefined);
        });
        }
    tree._onDidChangeTreeData.fire(undefined);
}