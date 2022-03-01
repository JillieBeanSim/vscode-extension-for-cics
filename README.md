# Zowe CICS Explorer

[![version](https://vsmarketplacebadge.apphb.com/version-short/zowe.cics-extension-for-zowe.svg)](https://vsmarketplacebadge.apphb.com/version-short/Zowe.cics-extension-for-zowe.svg)
[![downloads](https://vsmarketplacebadge.apphb.com/downloads-short/zowe.cics-extension-for-zowe.svg)](https://vsmarketplacebadge.apphb.com/downloads-short/Zowe.cics-extension-for-zowe.svg)
[![slack](https://img.shields.io/badge/chat-on%20Slack-blue)](https://openmainframeproject.slack.com/archives/CUVE37Z5F)
[![open issues](https://img.shields.io/github/issues/zowe/vscode-extension-for-cics)](https://github.com/zowe/vscode-extension-for-cics/issues)


This CICS Extension for Zowe Explorer adds additional functionality to the popular VSCode extension, [Zowe Explorer](https://github.com/zowe/vscode-extension-for-zowe). This extension allows interactions with CICS regions and programs, and the ability to run commands against them.

## Contents
- [Features](#features)
- [Early Access Features](#early-access-features)
- [Getting Started](#getting-started)
    - [Create Profile](#create-profile)
    - [Update Profile](#update-profile)
    - [Hiding Profiles](#hiding-profiles)
    - [Deleting Profiles](#deleting-profiles)
- [CICS Resources](#cics-resources)
    - [Show and Filter Resources in a Region](#show-and-filter-resources-in-a-region)
    - [Show and Filter Resources in a Plex](#show-and-filter-resources-in-a-plex)
    - [Show and Filter Resources in an 'All' Resource Tree](#show-and-filter-resources-in-an-all-resource-tree)
    - [Show Attributes](#show-attributes)
    - [Enable and Disable](#enable-and-disable)
    - [New Copy and Phase In](#new-copy-and-phase-in)
    - [Open and Close Local Files](#open-and-close-local-files)
- [Untrusted TLS Certificates](#untrusted-tls-certificates)
- [Usage Tips](#usage-tips)
- [Providing feedback or help contributing](#providing-feedback-or-help-contributing)
    - [Checking the source of an error](#checking-the-source-of-an-error)
    - [Filing an issue](#filing-an-issue)

## Features

- Load profiles directly from Zowe instance locally installed.
- Create new Zowe CICS profiles and connect to them.
- Work with multiple regions containing programs, local transactions and local files within a plex in a comprehensible tree-like format.
- Perform actions such as `Enable`, `Disable`, `New Copy` and `Phase In` directly from the UI.
- Perform additional actions on local files including `Open` and `Close` directly from the UI.
- View and search attributes of resources and regions by right-clicking and using the dynamic filtering feature.
- Create new CICS profiles, update session details, and delete profiles using the user-friendly interface.
- Apply multiple filters to regions, programs, local transactions and/or local files.
- View and interact with all resources under a plex.

To Install CICS Extension for Zowe Explorer see [Installation](./docs/installation-guide.md)

# Early Access Features

> Please use Zowe Explorer `v2.0.0-next.202202221200` or higher with this extension. Previous versions can result in unexpected behaviour.

This version may receive breaking changes and is intended to gather early feedback on what may become a future LTS release.

The following sections below describe v1 features, but they have now changed in terms of functionality for the vNext release: [Create Profile](#create-profile), [Update Profile](#update-profile), [Deleting Profiles](#deleting-profiles). They will be updated in the near future.

To find details on what's changed and how to work with the technical preview release of the Zowe Explorer for IBM CICS extension, please refer to the [Early access - Using Team Configuration.md](https://github.com/zowe/vscode-extension-for-cics/blob/vNext-compatibility/docs/Early%20access%20-%20Using%20Team%20Configuration.md) file.

## Getting Started

### Create Profile

If you already have a Zowe CICS CLI profile the CICS tree will load the default profile on startup.  

If you don't have an existing CICS profile add one by selecting the + button in the CICS tree and choosing the option `Create New Session ...` to open a panel allowing connection details to be defined.  The connection must point to a CICS region's CICS Management Client Interface (CMCI) TCP/IP host name and port number.  The region can be a WUI server in a CICSPlex, a stand-alone Single Management Application Programming (SMSS) region, or a CICS system group.

If neither of the fields under 'CICS Details' are specified, the profile will show all CICSPlex for the WUI server.  Specify a Plex Name to just view data for a single CICSPlex. 

For a CICSPlex, all managed regions will be shown unless you specify a specific region name. Instead of a region name, you may also enter a CICS System Group to allow scoping of resources within the CICSPlex.

For a stand-alone CICS region, the Region Name may be entered but is optional.  Do not enter a CICSPlex name for a stand-alone CICS region.

It is recommended to leave these 'CICS Details' fields blank to test the connection, and then add the plex name and region or system group name later to narrow if needed.  If you are intending to use this profile with the Zowe CICS Command Line Interface (CLI) the region name and plex name are required.  

Configuring a CICS region to have a connection is a system programmer task and more details can be found in [Setting up CMCI with CICSPlex SM](https://www.ibm.com/docs/en/cics-ts/5.3?topic=explorer-setting-up-cmci-cicsplex-sm) or 
[Setting up CMCI in a stand-alone CICS region](https://www.ibm.com/docs/en/cics-ts/5.3?topic=suace-setting-up-cmci-in-stand-alone-cics-region).  If your CMCI connection is configured to use a self-signed certificate that your PC's trust store doesn't recognize, see [Untrusted TLS certificates](#untrusted-tls-certificates)

To show more than one CICS profile in the tree, select the + button and choose from the list of profiles.  Only profiles not already included in the CICS tree will be shown.  To view all Zowe CICS CLI profiles use the command `zowe profiles list cics` from a terminal.  

<p align="center">
<img src="./docs/images/create-profile.gif" alt="Zowe CICS Explorer profiles" width="700px"/> 
</p>

### Update Profile

Right-click against a profile to open up the profile menu actions and select the `Update Profile` command to update the session details. This will open a panel with fields containing the details used to create the connection. All fields apart from the 'Profile Name' can be modified.

Once the details have been updated, click the `Update Profile` button to apply the changes to the profile.

<p align="center">
<img src="./docs/images/update-profile.gif" alt="Zowe CICS Explorer Filter" width="700px"/> 
</p>

### Hiding Profiles

Open the menu actions for a profile by right-clicking a profile and select `Hide Profile` to hide it from the CICS view. To add the profile back, click the + button and select the profile from the quick pick list.

<p align="center">
<img src="./docs/images/hide-profile.gif" alt="Zowe CICS Explorer NewCopy Program" width="600px"/> 
</p>

### Deleting Profiles

Right-click a chosen profile, select `Delete Profile` and click the `Yes` button when prompted to confirm the action of permanently deleting the profile. The functionality deletes the CICS profile from the persistant storage directory `~/.zowe/profiles/cics`.

<p align="center">
<img src="./docs/images/delete-profile.gif" alt="Zowe CICS Explorer NewCopy Program" width="600px"/> 
</p>

## CICS Resources

Expand a CICS profile to see the region name, and expand the region to view its resources.  If the CICS profile is connected to a CMAS region that is part of a CICSPlex, the tree will show all of the regions managed by the CICSPlex.  If the CICS profile is for an SMSS region then just one region will be shown. Inactive regions in a plex are shown with an empty icon.

### Show and Filter Resources in a Region

Expand a CICS region to show folders for the resource types `Programs` <img src="./docs/images/resource-type-programs.png" width="16px"/>  , `Transactions` <img src="./docs/images/resource-type-transactions.png" width="16px"/> and `Local Files` <img src="./docs/images/resource-type-local-files.png" width="16px"/>.  Expand each type to show the resources. The number of resources in a resource tree will appear in square brackets next to the tree name.

The list of resources are pre-filtered to exclude many of the IBM supplied ones to narrow the contents to just include user programs.  Use the search icon <img src="./docs/images/resource-filter.png" width="16px"/>  against a resource type to apply a filter.  This can be an exact resource name or else you can use wildcards.  The search history is saved so you can recall previous searches.  

To reset the filter to its initial criteria use the clear filter icon <img src="./docs/images/resource-filter-clear.png" width="16px"/> against the resource type.  If you wish to see all resources in a region (including IBM supplied ones) you can use "*" as a filter.

<p align="center">
<img src="./docs/images/region-filter.gif" alt="Zowe CICS Explorer Filter" width="700px"/> 
</p>

**Tip:** To apply multiple filters, separate entries with a comma. You can append any filter with an *, which indicates wildcard searching. 

### Show and Filter Resources in a Plex

Similar to filtering resources in a region, it is also possible to apply a filter on a all region resources in a plex. Use the search icon <img src="./docs/images/resource-filter.png" width="16px"/>  inline with the `Regions` tree and then select either `Regions`,  `Programs`, `Local Transactions` or `Local Files` from the drop-down menu to specify which resource type the filter should be applied to for all regions in the plex. 

To reset the filter to its initial criteria use the clear filter icon <img src="./docs/images/resource-filter-clear.png" width="16px"/> against the `Regions` tree. This will open a drop-down menu which gives the option to clear the filter for all the `Regions`, `Programs`, `Local Transactions` or `Local Files` in the plex, and an option to otherwise clear `All` filters within the plex.

<p align="center">
<img src="./docs/images/plex-filter.gif" alt="Zowe CICS Explorer Filter" width="700px"/> 
</p>

**Tip:** To apply multiple filters, separate entries with a comma. You can append any filter with an *, which indicates wildcard searching. 

### Show and Filter Resources in an 'All' Resource Tree
Plexes contain an `All Programs`, `All Local Transactions` and `All Local Files` trees which contain all the corresponding resources from all regions in the plex.

To view resources under these trees, use the search icon <img src="./docs/images/resource-filter.png" width="16px"/> inline with the tree and apply a filter.

<p align="center">
<img src="./docs/images/all-resources.gif" alt="Zowe CICS Explorer Filter" width="700px"/> 
</p>

If the applied filter results in over 500 records, either change the filter to narrow down the search, or click the `view X more ...` item to retrieve 'X' more resources.
### Show Attributes

Right-click and use the pop-up menu against a program to list the available actions that can be performed. For every resource, including a CICS region, `Show Attributes` opens a viewer listing all attributes and their values.  The attributes page has a filter box at the top that lets you search for attributes matching the criteria.  

<p align="center">
<img src="./docs/images/show-attributes.gif" alt="Zowe CICS Explorer Filter" width="700px"/> 
</p>

### Enable and Disable

Right-click against a program, local transaction or local file to open up the pop-up menu and click `Disable [CICS resource]` to disable the resource. When a resource is already disabled the first option becomes `Enable [CICS resource]` to allow its enablement state to be toggled. A disabled resource is identified by a `(Disabled)` text next to its name.

<p align="center">
<img src="./docs/images/disable-enable.gif" alt="Zowe CICS Explorer Filter" width="700px"/> 
</p>

### New Copy and Phase In

Use `New Copy` <img src="./docs/images/program-newcopy-action.png" width="16px"/> and `Phase In` <img src="./docs/images/program-phasein-action.png" width="16px"/> actions against a CICS program to get the CICS region to load a fresh of the selected program into memory. This could be after you've edited a COBOL program source and successfully compiled it into a load library and now want to test your change.

The `newcopycnt` for a program which is greater than zero is shown next to the program item in the CICS resource tree.

<p align="center">
<img src="./docs/images/new-copy.gif" alt="Zowe CICS Explorer NewCopy Program" width="600px"/> 
</p>

### Open and Close Local Files

Right-click against a closed local file and perform the `Open Local File` menu action to toggle the `openstatus` attribute to 'OPEN'. 

To close a local file, right-click against an open local file and perform the `Close Local File` menu action. This will bring up a prompt on the bottom right corner requesting to choose one of `Wait`, `No Wait` or `Force` for the file busy condition. Once an option has been selected, the local file name will be appended with a `(Closed)` label upon success.

<p align="center">
<img src="./docs/images/open-close.gif" alt="Zowe CICS Explorer NewCopy Program" width="600px"/> 
</p>

## Untrusted TLS Certificates

If the CMCI connection is using a TLS certificate that your PC doesn't have in its trust store, then by default the connection will be rejected as potentially this could be from an unsafe site.  To override this behavior,  either set the `Only accept trusted TLS certificates` field on the form when creating/updating the profile to `False`.  This is the same as setting `rejectUnauthorized=false` on the Zowe CICS CLI profile.

If you define a profile as only accepting trusted TLS certificates when the Zowe Explorer first connects it will detect the mismatch and allow you to override the setting and proceed.  This is done through a pop-up message with a `Yes` button to accept the untrusted certificate authority, which changes the profile's setting.  

<p align="center">
<img src="./docs/images/untrusted-cert.gif" alt="Zowe CICS Explorer NewCopy Program" width="600px"/> 
</p>

## Usage tips

- All menu action commands available via right-clicking a profile/resource (excluding `Show Attributes`) can be applied on multiple items by multi-selecting nodes of the same type before right-clicking and selecting the command.
    - To multi-select, either hold `Ctrl`/`Cmd` key while clicking resources, or select the first item in a list of nodes then hold `Shift` and click both the last item to select a consecutive list of nodes.

- Click the refresh icon <img src="./docs/images/refresh-icon.png" width="16px"/> at the top of the CICS view to reload the resources in every region.

## Providing feedback or help contributing
### Checking the source of an error
Before filing an issue, check if an error is arising from the Zowe Explorer for IBM CICS extension and not the Zowe Explorer extension by expanding the error message and checking if the `Source` is `Zowe Explorer for IBM CICS (Extension)`. 
<p align="center">
<img src="./docs/images/expand-error-cics.gif" alt="Zowe CICS Explorer NewCopy Program" width="600px"/> 
</p>

Error messages arising from the Zowe Explorer extension will have the `Source` as `Zowe Explorer(Extension)`.

### Filing an issue
To file issues, use the [Zowe Explorer for IBM CICS issue list](https://github.com/zowe/vscode-extension-for-cics/issues), or chat with use on [Slack](https://openmainframeproject.slack.com/archives/CUVE37Z5F) by indicating the message is for the Zowe Explorer for IBM CICS extension.